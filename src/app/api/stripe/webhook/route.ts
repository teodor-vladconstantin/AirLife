import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

const db = () => createClient(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });

// Stripe -> AirLife. Set the endpoint https://airlife.ro/api/stripe/webhook with events
// checkout.session.completed, checkout.session.async_payment_succeeded, checkout.session.expired and put its signing secret in STRIPE_WEBHOOK_SECRET.
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get("stripe-signature");
  if (!secret || !sig) return NextResponse.json({ error: "not_configured" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(await req.text(), sig, secret);
  } catch {
    return NextResponse.json({ error: "bad_signature" }, { status: 400 });
  }

  const sb = db();
  const session = event.data.object as Stripe.Checkout.Session;
  const orderId = session.metadata?.order_id;
  if (!orderId) return NextResponse.json({ ok: true });

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    if (session.payment_status === "paid") {
      await sb.from("orders").update({ payment_status: "paid", status: "confirmed", confirmed_at: new Date().toISOString() }).eq("id", orderId).eq("payment_status", "unpaid");
    }
  } else if (event.type === "checkout.session.expired") {
    // Unpaid and abandoned: cancel and give the reserved stock back.
    const { data: order } = await sb.from("orders").select("status,payment_status").eq("id", orderId).single();
    if (order && order.payment_status === "unpaid" && order.status === "pending") {
      const { data: items } = await sb.from("order_items").select("product_id,quantity").eq("order_id", orderId);
      for (const it of items ?? []) {
        if (!it.product_id) continue;
        const { data: p } = await sb.from("products").select("stock").eq("id", it.product_id).single();
        await sb.from("products").update({ stock: (p?.stock ?? 0) + it.quantity }).eq("id", it.product_id);
      }
      await sb.from("orders").update({ status: "cancelled" }).eq("id", orderId);
    }
  }
  return NextResponse.json({ received: true });
}
