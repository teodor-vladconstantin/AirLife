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

type Eligibility = "ok" | "login_required" | "not_purchased" | "already_reviewed";

// Can this visitor review this product? Signed in + a paid order containing the product + no review yet.
async function eligibility(sb: ReturnType<typeof db>, bearer: string | undefined, productId: string): Promise<{ state: Eligibility; userId?: string }> {
  const userId = bearer ? (await sb.auth.getUser(bearer)).data.user?.id : undefined;
  if (!userId) return { state: "login_required" };
  const { data: bought } = await sb.from("order_items").select("id, orders!inner(user_id, payment_status)").eq("product_id", productId).eq("orders.user_id", userId).eq("orders.payment_status", "paid").limit(1);
  if (!bought?.length) return { state: "not_purchased", userId };
  const { data: mine } = await sb.from("product_reviews").select("id").eq("product_id", productId).eq("user_id", userId).limit(1);
  return { state: mine?.length ? "already_reviewed" : "ok", userId };
}

// The product page asks this first, so the review form is offered only to customers who may use it.
export async function GET(req: Request) {
  const productId = z.string().uuid().safeParse(new URL(req.url).searchParams.get("productId"));
  if (!productId.success) return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  const bearer = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const { state } = await eligibility(db(), bearer, productId.data);
  return NextResponse.json({ state });
}

// A signed-in customer who bought and paid for the product can leave one review per product.
// It is saved as "pending" and shows on the site after an admin approves it.
export async function POST(req: Request) {
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  const { productId, rating, title, body: text, name } = parsed.data;

  const sb = db();
  const bearer = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const { state, userId } = await eligibility(sb, bearer, productId);
  if (state === "login_required") return NextResponse.json({ error: "login_required" }, { status: 401 });
  if (state === "not_purchased") return NextResponse.json({ error: "not_purchased" }, { status: 403 });
  if (state === "already_reviewed") return NextResponse.json({ error: "already_reviewed" }, { status: 409 });

  const { error } = await sb.from("product_reviews").insert({ product_id: productId, user_id: userId, author_name: name, rating, title: title || null, body: text, verified_purchase: true, status: "pending" });
  if (error) return NextResponse.json({ error: error.code === "23505" ? "already_reviewed" : "server_error" }, { status: error.code === "23505" ? 409 : 500 });
  return NextResponse.json({ ok: true });
}
