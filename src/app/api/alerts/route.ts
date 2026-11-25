import { NextResponse } from "next/server";
import { z } from "zod";
import { isShopVisible, salePricing } from "@/lib/pricing";
import { adminDb } from "@/lib/email/db";
import { verifyTurnstile } from "@/lib/turnstile";

export const runtime = "nodejs";

const body = z.object({
  productId: z.string().uuid(),
  email: z.string().email().max(200),
  kind: z.enum(["back_in_stock", "price_drop"]),
  token: z.string().optional(), // Turnstile
});

// "Anunță-mă": one alert per (email, product, kind). The daily job sends a single email when the product is back in stock
// or its price is below the price seen at sign-up, then marks the alert as notified.
export async function POST(req: Request) {
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  const { productId, kind, token } = parsed.data;
  const email = parsed.data.email.toLowerCase();
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (!(await verifyTurnstile(token, ip))) return NextResponse.json({ error: "captcha" }, { status: 403 });

  const sb = adminDb();
  const { data: p } = await sb.from("products").select("*").eq("id", productId).maybeSingle();
  if (!p || !isShopVisible(p)) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (kind === "back_in_stock" && p.stock > 0) return NextResponse.json({ error: "already_in_stock" }, { status: 409 });

  const { error } = await sb.from("stock_alerts").upsert(
    { email, product_id: productId, kind, price_at_signup: salePricing(p).price, notified_at: null },
    { onConflict: "email,product_id,kind" },
  );
  if (error) return NextResponse.json({ error: "server_error" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
