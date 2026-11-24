import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

export const runtime = "nodejs";

const body = z.object({
  productId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  title: z.string().trim().max(120).optional(),
  body: z.string().trim().min(10).max(2000),
  name: z.string().trim().min(2).max(80),
});

const db = () => createClient(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });

// A signed-in customer who bought and paid for the product can leave one review per product.
// It is saved as "pending" and shows on the site after an admin approves it.
export async function POST(req: Request) {
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  const { productId, rating, title, body: text, name } = parsed.data;

  const sb = db();
  const bearer = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const userId = bearer ? (await sb.auth.getUser(bearer)).data.user?.id : undefined;
  if (!userId) return NextResponse.json({ error: "login_required" }, { status: 401 });

  const { data: bought, error: bErr } = await sb
    .from("order_items")
    .select("id, orders!inner(user_id, payment_status)")
    .eq("product_id", productId)
    .eq("orders.user_id", userId)
    .eq("orders.payment_status", "paid")
    .limit(1);
  if (bErr) return NextResponse.json({ error: "server_error" }, { status: 500 });
  if (!bought?.length) return NextResponse.json({ error: "not_purchased" }, { status: 403 });

  const { error } = await sb.from("product_reviews").insert({ product_id: productId, user_id: userId, author_name: name, rating, title: title || null, body: text, verified_purchase: true, status: "pending" });
  if (error) return NextResponse.json({ error: error.code === "23505" ? "already_reviewed" : "server_error" }, { status: error.code === "23505" ? 409 : 500 });
  return NextResponse.json({ ok: true });
}
