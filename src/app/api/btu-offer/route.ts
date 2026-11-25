import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { render } from "@react-email/components";
import { z } from "zod";
import { verifyTurnstile } from "@/lib/turnstile";
import { loadCategoryProducts } from "@/lib/catalog";
import { btuOf, pickRecommended, type BtuProduct } from "@/lib/btu";
import { resend, REPLY_TO } from "@/lib/email/client";
import BtuOffer, { btuOfferSubject } from "@/emails/BtuOffer";

export const runtime = "nodejs";

const schema = z.object({
  phone: z.string().trim().max(30).default(""),
  email: z.string().trim().email().max(200).optional().or(z.literal("")),
  areaM2: z.number().min(1).max(500),
  volumeM3: z.number().min(1).max(2500),
  btuNeeded: z.number().min(1000).max(100000),
  btuRecommended: z.number().min(1000).max(100000),
  website: z.string().optional(), // honeypot
  token: z.string().optional(), // Turnstile
}).refine((v) => v.phone.length >= 6 || !!v.email, { message: "contact_required" });

const FROM = "AirLife <comenzi@news.airlife.ro>";
const ADMIN_TO = "contact@airlife.ro";
const SITE = "https://airlife.ro";

// ponytail: in-memory limiter, resets per serverless instance. Turnstile is the real gate.
const hits = new Map<string, number[]>();
const limited = (key: string, max: number, windowMs: number) => {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  const over = recent.length >= max;
  if (!over) recent.push(now);
  hits.set(key, recent);
  return over;
};

// "Primește oferta" from the BTU calculator: saved like any other request (orders table, admin > Comenzi),
// follow-up email to the visitor (if they gave an email) and a notification to the shop.
export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const p = parsed.data;
  if (p.website) return NextResponse.json({ ok: true }); // bot

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (limited(`ip:${ip}`, 5, 10 * 60_000)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  if (!(await verifyTurnstile(p.token, ip))) return NextResponse.json({ error: "captcha" }, { status: 403 });

  // Recommended units come from the live catalog, not from the browser.
  const rows = await loadCategoryProducts("aer-conditionat").catch(() => []);
  const all = rows.flatMap((r): BtuProduct[] => {
    const btu = btuOf(r.name);
    return btu && r.stock > 0 && r.image_url ? [{ path: r.slug ?? r.id, name: r.name, price: r.price, image: r.image_url, btu }] : [];
  });
  const picks = pickRecommended(all, p.btuNeeded);

  const sb = createClient(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
  const { data: orderNumber, error: numError } = await sb.rpc("generate_order_number");
  if (numError) return NextResponse.json({ error: "server" }, { status: 500 });
  const details = `Cameră ${p.areaM2} mp (${p.volumeM3} mc), necesar ${p.btuNeeded} BTU, recomandat ${p.btuRecommended} BTU.${picks.length ? ` Produse propuse: ${picks.map((x) => `${x.name} (${x.price} RON)`).join("; ")}.` : ""}`;
  const { error } = await sb.from("orders").insert({
    order_number: orderNumber as string, customer_name: "Client calculator BTU", customer_email: p.email || "", customer_phone: p.phone,
    shipping_address: {}, payment_method: "bank_transfer", subtotal: 0, shipping_cost: 0, total_amount: 0,
    customer_notes: `[Ofertă BTU] ${details}`, status: "pending",
  });
  if (error) return NextResponse.json({ error: "server" }, { status: 500 });

  // Emails never fail the request: the lead is already saved.
  try {
    const data = {
      areaM2: p.areaM2, volumeM3: p.volumeM3, btuNeeded: p.btuNeeded, btuRecommended: p.btuRecommended,
      products: picks.map((x) => ({ name: x.name, slug: x.path, price: x.price, image_url: x.image.startsWith("http") ? x.image : SITE + x.image })),
    };
    if (p.email) {
      const el = BtuOffer({ d: data });
      const r = await resend.emails.send(
        { from: FROM, to: p.email, replyTo: REPLY_TO, subject: btuOfferSubject(data), html: await render(el), text: await render(el, { plainText: true }) },
        { idempotencyKey: `btu-offer-${orderNumber}` },
      );
      if (r.error) console.error("btu offer email error:", r.error.message);
    }
    await resend.emails.send(
      { from: FROM, to: ADMIN_TO, subject: `Lead calculator BTU ${orderNumber}`, text: `Telefon: ${p.phone || "-"}\nEmail: ${p.email || "-"}\n${details}` },
      { idempotencyKey: `btu-offer-admin-${orderNumber}` },
    );
  } catch (e) {
    console.error("btu offer email failed:", (e as Error)?.message);
  }
  return NextResponse.json({ ok: true, orderNumber });
}
