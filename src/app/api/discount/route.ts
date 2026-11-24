import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { isShopVisible, salePricing } from "@/lib/pricing";
import { evaluateDiscount } from "@/lib/discount";

export const runtime = "nodejs";

const body = z.object({
  code: z.string().min(1).max(40),
  items: z.array(z.object({ id: z.string().uuid(), quantity: z.number().int().min(1).max(20) })).min(1).max(50),
});
const db = () => createClient(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });

// Preview of a discount code for the checkout summary. The real amount is recomputed again in /api/checkout.
export async function POST(req: Request) {
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, reason: "not_found" }, { status: 400 });
  const sb = db();
  const { data: products } = await sb.from("products").select("*").in("id", parsed.data.items.map((i) => i.id));
  let subtotal = 0;
  for (const it of parsed.data.items) {
    const p = products?.find((x) => x.id === it.id);
    if (!p || !isShopVisible(p)) return NextResponse.json({ ok: false, reason: "not_found" }, { status: 409 });
    subtotal += salePricing(p).price * it.quantity;
  }
  return NextResponse.json(await evaluateDiscount(sb, parsed.data.code, subtotal));
}
