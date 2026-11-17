import { NextResponse } from "next/server";
import { adminDb, siteUrl } from "@/lib/email/db";
import { authorized, sendMany, type Msg } from "@/lib/email/send";
import Welcome, { welcomeSubject } from "@/emails/Welcome";
import ServiceReminder, { reminderSubject } from "@/emails/ServiceReminder";

const DAY = 86_400_000;
const iso = (t: number) => new Date(t).toISOString();
const unsub = (token: string) => `${siteUrl()}/unsubscribe?token=${token}`;

type Row = { id: string; email: string; unsubscribe_token: string; product_type: string | null };
const cols = "id, email, unsubscribe_token, product_type";

// Daily job (vercel.json). Each send is "claimed" first by stamping the sent_at column, so two overlapping
// runs can't email the same person twice; if the send fails the stamp is reverted and tomorrow retries.
export async function GET(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const db = adminDb();
  const now = Date.now();
  const day = iso(now).slice(0, 10);
  const result: Record<string, unknown> = {};

  // 1) Welcome, day 3. Window of 3-10 days after confirmation so a late first deploy doesn't blast old subscribers.
  const { data: w } = await db
    .from("subscribers")
    .select(cols)
    .eq("status", "active")
    .is("welcome2_sent_at", null)
    .lte("consent_at", iso(now - 3 * DAY))
    .gte("consent_at", iso(now - 10 * DAY))
    .limit(500);
  const welcomeClaimed: Row[] = [];
  for (const r of (w ?? []) as Row[]) {
    const { data } = await db.from("subscribers").update({ welcome2_sent_at: iso(now) }).eq("id", r.id).is("welcome2_sent_at", null).select("id");
    if (data?.length) welcomeClaimed.push(r);
  }
  const wMsgs: Msg[] = welcomeClaimed.map((r) => ({
    id: r.id, to: r.email, token: r.unsubscribe_token, subject: welcomeSubject(3),
    element: Welcome({ day: 3, unsubscribeUrl: unsub(r.unsubscribe_token) }),
  }));
  const wRes = await sendMany(wMsgs, `welcome3-${day}`);
  if (wRes.failedIds.length) await db.from("subscribers").update({ welcome2_sent_at: null }).in("id", wRes.failedIds);
  result.welcome3 = { sent: wRes.sent, failed: wRes.failedIds.length };

  // 2) Service reminder: 11 to 24 months after last_service_date, at most one per service visit.
  const from = new Date(now); from.setMonth(from.getMonth() - 24);
  const to = new Date(now); to.setMonth(to.getMonth() - 11);
  const { data: rem } = await db
    .from("subscribers")
    .select(`${cols}, last_service_date, reminder_sent_at`)
    .eq("status", "active")
    .gte("last_service_date", from.toISOString().slice(0, 10))
    .lte("last_service_date", to.toISOString().slice(0, 10))
    .limit(500);
  const remClaimed: (Row & { prev: string | null })[] = [];
  for (const r of (rem ?? []) as (Row & { last_service_date: string; reminder_sent_at: string | null })[]) {
    // already reminded for this service visit?
    if (r.reminder_sent_at && r.reminder_sent_at >= r.last_service_date) continue;
    const q = db.from("subscribers").update({ reminder_sent_at: iso(now) }).eq("id", r.id);
    const { data } = await (r.reminder_sent_at ? q.eq("reminder_sent_at", r.reminder_sent_at) : q.is("reminder_sent_at", null)).select("id");
    if (data?.length) remClaimed.push({ ...r, prev: r.reminder_sent_at });
  }
  const rMsgs: Msg[] = remClaimed.map((r) => ({
    id: r.id, to: r.email, token: r.unsubscribe_token, subject: reminderSubject,
    element: ServiceReminder({ productType: r.product_type, unsubscribeUrl: unsub(r.unsubscribe_token) }),
  }));
  const rRes = await sendMany(rMsgs, `reminder-${day}`);
  for (const id of rRes.failedIds) {
    await db.from("subscribers").update({ reminder_sent_at: remClaimed.find((c) => c.id === id)?.prev ?? null }).eq("id", id);
  }
  result.reminder = { sent: rRes.sent, failed: rRes.failedIds.length };

  return NextResponse.json(result);
}
