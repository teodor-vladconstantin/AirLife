import { createClient } from "@supabase/supabase-js";
import { render } from "@react-email/components";
import { resend, REPLY_TO } from "./client";
import OrderEmail, { OrderAdminEmail, orderSubject, type OrderEmailKind, type OrderEmailData } from "@/emails/OrderEmail";

// Transactional mail (order confirmation, payment, shipping...). Sent from the verified news. subdomain; replies go to contact@.
const ORDERS_FROM = "AirLife <comenzi@news.airlife.ro>";
const ADMIN_TO = "contact@airlife.ro";

const db = () => createClient(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });

async function load(orderId: string): Promise<OrderEmailData | null> {
  const sb = db();
  const { data: o } = await sb.from("orders").select("*").eq("id", orderId).single();
  if (!o) return null;
  const { data: items } = await sb.from("order_items").select("product_name,quantity,unit_price").eq("order_id", orderId);
  return { ...o, items: items ?? [] } as OrderEmailData;
}

// Never throws: a failed email must not fail the order. The idempotency key stops duplicates when a webhook is retried (24h).
export async function sendOrderEmail(orderId: string, kind: OrderEmailKind): Promise<void> {
  try {
    const o = await load(orderId);
    if (!o || !o.customer_email || !o.items.length) return; // service/contact requests share the orders table: no items = no order email
    const el = OrderEmail({ kind, o });
    const sent = await resend.emails.send(
      { from: ORDERS_FROM, to: o.customer_email, replyTo: REPLY_TO, subject: orderSubject(kind, o.order_number), html: await render(el), text: await render(el, { plainText: true }) },
      { idempotencyKey: `order-${kind}-${orderId}` },
    );
    if (sent.error) console.error("order email error:", sent.error.message); // Resend returns errors instead of throwing
    if (kind === "placed" || kind === "paid") {
      const ad = OrderAdminEmail({ kind, o });
      await resend.emails.send(
        { from: ORDERS_FROM, to: ADMIN_TO, subject: `${kind === "paid" ? "Comandă plătită" : "Comandă nouă"} ${o.order_number}`, html: await render(ad), text: await render(ad, { plainText: true }) },
        { idempotencyKey: `order-admin-${kind}-${orderId}` },
      );
    }
  } catch (e) {
    console.error("order email failed:", (e as Error)?.message);
  }
}
