import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { stripe, paymentsEnabled } from "@/lib/stripe";
import { isShopVisible, salePricing } from "@/lib/pricing";
import { verifyTurnstile } from "@/lib/turnstile";
import { evaluateDiscount } from "@/lib/discount";

export const runtime = "nodejs";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://airlife.ro";
const FREE_SHIPPING_FROM = 1000;
const SHIPPING = 20;

const body = z.object({
  items: z.array(z.object({ id: z.string().uuid(), quantity: z.number().int().min(1).max(20) })).min(1).max(50),
  customer: z.object({ name: z.string().min(2).max(120), email: z.string().email().max(200), phone: z.string().min(6).max(30) }),
  address: z.object({ county: z.string().min(2).max(80), city: z.string().min(2).max(80), address: z.string().min(3).max(200), postalCode: z.string().max(12).optional() }),
  paymentMethod: z.enum(["card_online"]), // card only; cash on delivery was removed, bank transfer stays off
  notes: z.string().max(500).optional(),
  token: z.string().optional(), // Turnstile
  discountCode: z.string().max(40).optional(),
});

const db = () => createClient(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
const bani = (n: number) => Math.round(n * 100);

// Creates the order with prices read from the database (never from the browser), reserves stock,
// then returns the Stripe Checkout URL (card payment).
export async function POST(req: Request) {
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  const { items, customer, address, paymentMethod, notes, token, discountCode } = parsed.data;
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (!(await verifyTurnstile(token, ip))) return NextResponse.json({ error: "captcha" }, { status: 403 });
  if (!paymentsEnabled()) return NextResponse.json({ error: "card_payments_disabled" }, { status: 503 });

  const sb = db();
  // Logged-in customers: link the order to the account so it shows up in "Comenzile mele" (guests order with userId null).
  const bearer = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const userId = bearer ? (await sb.auth.getUser(bearer)).data.user?.id ?? null : null;
  const { data: products, error: pErr } = await sb.from("products").select("*").in("id", items.map((i) => i.id));
  if (pErr || !products) return NextResponse.json({ error: "products_unavailable" }, { status: 500 });

  const lines = [];
  for (const it of items) {
    const p = products.find((x) => x.id === it.id);
    if (!p || !isShopVisible(p)) return NextResponse.json({ error: "product_unavailable", id: it.id }, { status: 409 });
    if ((p.stock ?? 0) < it.quantity) return NextResponse.json({ error: "out_of_stock", name: p.name }, { status: 409 });
    lines.push({ p, quantity: it.quantity, unit: salePricing(p).price });
  }
  const subtotal = lines.reduce((s, l) => s + l.unit * l.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING; // free shipping is judged on the cart value before the code
  let discount = 0;
  let appliedCode: string | null = null;
  if (discountCode?.trim()) {
    const d = await evaluateDiscount(sb, discountCode, subtotal);
    if ("reason" in d) return NextResponse.json({ error: "invalid_discount", reason: d.reason }, { status: 409 });
    discount = d.amount;
    appliedCode = d.code;
  }
  const total = Math.round((subtotal - discount + shipping) * 100) / 100;

  const { data: orderNumber } = await sb.rpc("generate_order_number");
  const { data: order, error: oErr } = await sb.from("orders").insert({
    order_number: orderNumber, user_id: userId, customer_name: customer.name, customer_email: customer.email, customer_phone: customer.phone,
    shipping_address: address, payment_method: paymentMethod, subtotal, shipping_cost: shipping, total_amount: total,
    customer_notes: notes || null, status: "pending",
    ...(appliedCode ? { discount_code: appliedCode, discount_amount: discount } : {}),
  }).select().single();
  if (oErr || !order) return NextResponse.json({ error: "order_failed" }, { status: 500 });

  // Give reserved stock back (adds the quantity to whatever is in the database now).
  const giveBack = async (ls: typeof lines) => {
    for (const l of ls) {
      const { data: cur } = await sb.from("products").select("stock").eq("id", l.p.id).single();
      await sb.from("products").update({ stock: (cur?.stock ?? 0) + l.quantity }).eq("id", l.p.id);
    }
  };
  const { error: iErr } = await sb.from("order_items").insert(lines.map((l) => ({
    order_id: order.id, product_id: l.p.id, product_name: l.p.name, product_category: l.p.category, product_image_url: l.p.image_url,
    quantity: l.quantity, unit_price: l.unit, total_price: l.unit * l.quantity,
  })));
  if (iErr) { await sb.from("orders").delete().eq("id", order.id); return NextResponse.json({ error: "order_failed" }, { status: 500 }); }

  // the customer is buying: close any open abandoned-cart record (best effort)
  void Promise.resolve(sb.from("abandoned_carts").update({ recovered_at: new Date().toISOString() }).eq("email", customer.email.toLowerCase()).is("recovered_at", null)).catch(() => {});

  // count the use of the code (conditional update: no lost increments when two orders race)
  const countCodeUse = async (delta: 1 | -1) => {
    if (!appliedCode) return;
    for (let i = 0; i < 3; i++) {
      const { data: cur } = await sb.from("discount_codes").select("used_count").eq("code", appliedCode).single();
      if (!cur) return;
      const { data: ok } = await sb.from("discount_codes").update({ used_count: Math.max(0, cur.used_count + delta) }).eq("code", appliedCode).eq("used_count", cur.used_count).select("code");
      if (ok?.length) return;
    }
  };
  await countCodeUse(1);

  const taken: typeof lines = [];
  for (const l of lines) {
    const { data: ok } = await sb.rpc("decrease_product_stock", { p_product_id: l.p.id, p_quantity: l.quantity });
    if (!ok) { await giveBack(taken); await countCodeUse(-1); await sb.from("orders").delete().eq("id", order.id); return NextResponse.json({ error: "out_of_stock", name: l.p.name }, { status: 409 }); }
    taken.push(l);
  }

  try {
    const session = await stripe().checkout.sessions.create({
      mode: "payment",
      locale: "ro",
      customer_email: customer.email,
      client_reference_id: order.id,
      metadata: { order_id: order.id, order_number: order.order_number },
      payment_intent_data: { metadata: { order_id: order.id, order_number: order.order_number } },
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      ...(discount > 0 ? { discounts: [{ coupon: (await stripe().coupons.create({ amount_off: bani(discount), currency: "ron", duration: "once", name: `Cod ${appliedCode}`, max_redemptions: 1 })).id }] } : {}),
      line_items: [
        ...lines.map((l) => ({ quantity: l.quantity, price_data: { currency: "ron", unit_amount: bani(l.unit), product_data: { name: l.p.name, images: l.p.image_url?.startsWith("http") ? [l.p.image_url] : undefined } } })),
        ...(shipping > 0 ? [{ quantity: 1, price_data: { currency: "ron", unit_amount: bani(shipping), product_data: { name: "Transport prin curier" } } }] : []),
      ],
      success_url: `${SITE}/comanda-confirmata?o=${encodeURIComponent(order.order_number)}`,
      cancel_url: `${SITE}/checkout`,
    });
    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("stripe checkout failed:", (e as Error)?.message);
    // Could not reach Stripe: give the stock back and drop the unpaid order.
    await giveBack(lines);
    await countCodeUse(-1);
    await sb.from("orders").delete().eq("id", order.id);
    return NextResponse.json({ error: "payment_unavailable" }, { status: 502 });
  }
}
