import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

export const runtime = "nodejs";

const body = z.object({ orderNumber: z.string().min(4).max(30), email: z.string().email().max(200) });

// ponytail: in-memory limiter, resets per serverless instance; the order number + matching email is the real gate.
const hits = new Map<string, number[]>();
const limited = (key: string, max: number, windowMs: number) => {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  const over = recent.length >= max;
  if (!over) recent.push(now);
  hits.set(key, recent);
  return over;
};

// Guest order tracking: needs the order number AND the email used at checkout. Never returns phone or address.
export async function POST(req: Request) {
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const num = parsed.data.orderNumber.trim().toUpperCase();
  const email = parsed.data.email.trim().toLowerCase();
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (limited(`ip:${ip}`, 20, 10 * 60_000) || limited(`order:${num}`, 8, 10 * 60_000)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const sb = createClient(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
  const { data: o } = await sb.from("orders")
    .select("id,order_number,customer_email,status,payment_status,payment_method,subtotal,shipping_cost,total_amount,tracking_number,courier,created_at,confirmed_at,shipped_at,delivered_at")
    .eq("order_number", num).maybeSingle();
  if (!o || String(o.customer_email ?? "").toLowerCase() !== email) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const { data: items } = await sb.from("order_items").select("product_name,quantity,unit_price").eq("order_id", o.id);
  if (!items?.length) return NextResponse.json({ error: "not_found" }, { status: 404 }); // service requests share this table
  const { id: _id, customer_email: _e, ...order } = o;
  return NextResponse.json({ order, items });
}
