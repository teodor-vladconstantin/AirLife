import { render } from "@react-email/components";
import { adminDb, siteUrl } from "./db";
import { sendMany, type Msg } from "./send";
import { resend, REPLY_TO } from "./client";
import { ORDERS_FROM } from "./order";
import { salePricing, isShopVisible } from "@/lib/pricing";
import CartReminder, { cartReminderSubject, type CartLine } from "@/emails/CartReminder";
import StockAlert, { stockAlertSubject } from "@/emails/StockAlert";
import ReviewRequest, { reviewRequestSubject } from "@/emails/ReviewRequest";

const H = 3_600_000;
const DAY = 24 * H;
const iso = (t: number) => new Date(t).toISOString();
const unsub = (token: string) => `${siteUrl()}/unsubscribe?token=${token}`;

// Each job "claims" a row by stamping it before sending, so overlapping runs never email twice;
// if a send fails the stamp is reverted and the next run retries. A missing table (migration not run) is a quiet no-op.

// Cart reminders: 1st after 3 hours of inactivity, 2nd at least 2 days after the 1st. Stops after 10 days or once an order follows.
export async function cartReminders(now = Date.now()) {
  const db = adminDb();
  const { data, error } = await db.from("abandoned_carts").select("*").is("recovered_at", null).gte("updated_at", iso(now - 10 * DAY)).limit(500);
  if (error || !data) return { skipped: true };
  const out = { first: 0, second: 0, recovered: 0, failed: 0 };

  const due: { row: (typeof data)[number]; second: boolean }[] = [];
  for (const r of data) {
    const { data: ord } = await db.from("orders").select("id").ilike("customer_email", r.email).gte("created_at", r.updated_at).limit(1);
    if (ord?.length) { await db.from("abandoned_carts").update({ recovered_at: iso(now) }).eq("id", r.id); out.recovered++; continue; }
    if (!r.reminder1_sent_at && new Date(r.updated_at).getTime() <= now - 3 * H) due.push({ row: r, second: false });
    else if (r.reminder1_sent_at && !r.reminder2_sent_at && new Date(r.reminder1_sent_at).getTime() <= now - 2 * DAY) due.push({ row: r, second: true });
  }
  for (const second of [false, true]) {
    const group = due.filter((d) => d.second === second);
    const col = second ? "reminder2_sent_at" : "reminder1_sent_at";
    const claimed: typeof group = [];
    for (const d of group) {
      const { data: won } = await db.from("abandoned_carts").update({ [col]: iso(now) }).eq("id", d.row.id).is(col, null).select("id");
      if (won?.length) claimed.push(d);
    }
    const msgs: Msg[] = claimed.map(({ row }) => ({
      id: row.id, to: row.email, token: row.unsubscribe_token, subject: cartReminderSubject(second),
      element: CartReminder({ second, lines: row.items as CartLine[], total: Number(row.total), unsubscribeUrl: unsub(row.unsubscribe_token) }),
    }));
    const res = await sendMany(msgs, `cart${second ? 2 : 1}-${iso(now).slice(0, 10)}`);
    if (res.failedIds.length) await db.from("abandoned_carts").update({ [col]: null }).in("id", res.failedIds);
    out.failed += res.failedIds.length;
    out[second ? "second" : "first"] += res.sent;
  }
  return out;
}

// Back-in-stock and price-drop alerts requested on the product page.
export async function stockAlerts(now = Date.now()) {
  const db = adminDb();
  const { data, error } = await db.from("stock_alerts").select("*, products(*)").is("notified_at", null).limit(500);
  if (error || !data) return { skipped: true };
  const claimed: typeof data = [];
  for (const a of data) {
    const p = a.products;
    if (!p || !isShopVisible(p) || p.stock <= 0 || !p.slug) continue;
    const price = salePricing(p).price;
    const hit = a.kind === "back_in_stock" || price < Number(a.price_at_signup ?? Infinity) - 0.005;
    if (!hit) continue;
    const { data: won } = await db.from("stock_alerts").update({ notified_at: iso(now) }).eq("id", a.id).is("notified_at", null).select("id");
    if (won?.length) claimed.push(a);
  }
  const msgs: Msg[] = claimed.map((a) => {
    const p = a.products!;
    const sp = salePricing(p);
    return {
      id: a.id, to: a.email, token: a.unsubscribe_token, subject: stockAlertSubject(a.kind, p.name),
      element: StockAlert({ kind: a.kind, name: p.name, slug: p.slug!, image_url: p.image_url, price: sp.price, oldPrice: a.kind === "price_drop" ? Number(a.price_at_signup) : sp.compare_at, unsubscribeUrl: unsub(a.unsubscribe_token) }),
    };
  });
  const res = await sendMany(msgs, `alerts-${iso(now).slice(0, 10)}`);
  if (res.failedIds.length) await db.from("stock_alerts").update({ notified_at: null }).in("id", res.failedIds);
  return { sent: res.sent, failed: res.failedIds.length };
}

// Review request: once per paid order, 7 days after it was marked delivered (and within 60 days).
export async function reviewRequests(now = Date.now()) {
  const db = adminDb();
  const { data, error } = await db.from("orders").select("id, order_number, customer_email, delivered_at")
    .eq("status", "delivered").eq("payment_status", "paid").is("review_request_sent_at", null)
    .lte("delivered_at", iso(now - 7 * DAY)).gte("delivered_at", iso(now - 60 * DAY)).limit(100);
  if (error || !data) return { skipped: true };
  let sent = 0, failed = 0;
  for (const o of data) {
    const { data: won } = await db.from("orders").update({ review_request_sent_at: iso(now) }).eq("id", o.id).is("review_request_sent_at", null).select("id");
    if (!won?.length) continue;
    const { data: items } = await db.from("order_items").select("product_name, products(slug)").eq("order_id", o.id);
    const list = (items ?? []).flatMap((i) => { const slug = (i.products as unknown as { slug: string | null } | null)?.slug; return slug ? [{ name: i.product_name, slug }] : []; });
    if (!o.customer_email || !list.length) continue;
    try {
      const el = ReviewRequest({ orderNumber: o.order_number, items: list });
      const r = await resend.emails.send(
        { from: ORDERS_FROM, to: o.customer_email, replyTo: REPLY_TO, subject: reviewRequestSubject(o.order_number), html: await render(el), text: await render(el, { plainText: true }) },
        { idempotencyKey: `review-${o.id}` },
      );
      if (r.error) throw new Error(r.error.message);
      sent++;
    } catch {
      await db.from("orders").update({ review_request_sent_at: null }).eq("id", o.id);
      failed++;
    }
  }
  return { sent, failed };
}
