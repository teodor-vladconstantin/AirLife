import { NextResponse } from "next/server";
import { adminDb, siteUrl } from "@/lib/email/db";
import { authorized, sendMany, type Msg } from "@/lib/email/send";
import { cartReminders, reviewRequests, stockAlerts } from "@/lib/email/automations";
import { resend, REPLY_TO } from "@/lib/email/client";
import { ORDERS_FROM } from "@/lib/email/order";
import { reportText, runStockSync } from "@/lib/stockSync";
import Welcome, { welcomeSubject } from "@/emails/Welcome";

const DAY = 86_400_000;
const iso = (t: number) => new Date(t).toISOString();

type Row = { id: string; email: string; unsubscribe_token: string };

// Reading the supplier catalogs can take a few minutes when they rate limit us.
export const maxDuration = 300;

// Supplier stock and price sync, off until STOCK_SYNC_ENABLED=1. E-mails the shop when something changes or needs attention.
async function stockSync() {
  if (process.env.STOCK_SYNC_ENABLED !== "1") return { disabled: true };
  const notify = async (text: string) =>
    (await resend.emails.send({ from: ORDERS_FROM, to: REPLY_TO, subject: "Sincronizare stoc și prețuri furnizori", text })).error?.message;
  try {
    const plan = await runStockSync({ apply: true });
    const text = reportText(plan, true);
    return { changed: plan.changes.length, prices: plan.prices.length, purchases: plan.purchases.length, suppliers: plan.reports, emailError: text ? await notify(text) : undefined };
  } catch (e) {
    await notify(`Sincronizarea cu furnizorii a eșuat: ${(e as Error).message}`);
    throw e;
  }
}

// Daily job (vercel.json): welcome email, day 3. Each send is "claimed" first by stamping welcome2_sent_at, so two
// overlapping runs can't email the same person twice; if the send fails the stamp is reverted and tomorrow retries.
// Also: cart reminders, supplier stock sync, stock/price alerts, review requests.
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
    stock: await safe(stockSync), // before the alerts, so "back in stock" goes out on fresh numbers
    alerts: await safe(() => stockAlerts(now)),
    reviews: await safe(() => reviewRequests(now)),
  });
}
