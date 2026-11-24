import { NextResponse } from "next/server";
import { adminDb, siteUrl } from "@/lib/email/db";
import { authorized, sendMany, type Msg } from "@/lib/email/send";
import { cartReminders, reviewRequests, stockAlerts } from "@/lib/email/automations";
import Welcome, { welcomeSubject } from "@/emails/Welcome";

const DAY = 86_400_000;
const iso = (t: number) => new Date(t).toISOString();

type Row = { id: string; email: string; unsubscribe_token: string };

// Daily job (vercel.json): welcome email, day 3. Each send is "claimed" first by stamping welcome2_sent_at, so two
// overlapping runs can't email the same person twice; if the send fails the stamp is reverted and tomorrow retries.
export async function GET(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const db = adminDb();
  const now = Date.now();

  // Window of 3-10 days after confirmation so a late first deploy doesn't blast old subscribers.
  const { data } = await db
    .from("subscribers")
    .select("id, email, unsubscribe_token")
    .eq("status", "active")
    .is("welcome2_sent_at", null)
    .lte("consent_at", iso(now - 3 * DAY))
    .gte("consent_at", iso(now - 10 * DAY))
    .limit(500);

  const claimed: Row[] = [];
  for (const r of (data ?? []) as Row[]) {
    const { data: won } = await db.from("subscribers").update({ welcome2_sent_at: iso(now) }).eq("id", r.id).is("welcome2_sent_at", null).select("id");
    if (won?.length) claimed.push(r);
  }

  const msgs: Msg[] = claimed.map((r) => ({
    id: r.id, to: r.email, token: r.unsubscribe_token, subject: welcomeSubject(3),
    element: Welcome({ day: 3, unsubscribeUrl: `${siteUrl()}/unsubscribe?token=${r.unsubscribe_token}` }),
  }));
  const res = await sendMany(msgs, `welcome3-${iso(now).slice(0, 10)}`);
  if (res.failedIds.length) await db.from("subscribers").update({ welcome2_sent_at: null }).in("id", res.failedIds);
  const safe = async <T,>(f: () => Promise<T>) => { try { return await f(); } catch (e) { return { error: (e as Error)?.message ?? "failed" }; } };
  return NextResponse.json({
    welcome3: { sent: res.sent, failed: res.failedIds.length },
    carts: await safe(() => cartReminders(now)),
    alerts: await safe(() => stockAlerts(now)),
    reviews: await safe(() => reviewRequests(now)),
  });
}
