import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { verifyTurnstile } from "@/lib/turnstile";

export const runtime = "nodejs";

const schema = z.object({
  kind: z.string().trim().min(2).max(60),
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().max(30).default(""),
  email: z.string().trim().email().max(200).optional().or(z.literal("")),
  details: z.string().trim().min(1).max(2000),
  website: z.string().optional(), // honeypot
  token: z.string().optional(), // Turnstile
});

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

// Contact and service requests. They land in the orders table (admin > Comenzi), like before, but only after Turnstile passes.
export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const p = parsed.data;
  if (p.website) return NextResponse.json({ ok: true }); // bot

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (limited(`ip:${ip}`, 6, 10 * 60_000)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  if (!(await verifyTurnstile(p.token, ip))) return NextResponse.json({ error: "captcha" }, { status: 403 });

  const sb = createClient(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
  const { data: orderNumber, error: numError } = await sb.rpc("generate_order_number");
  if (numError) return NextResponse.json({ error: "server" }, { status: 500 });
  const { error } = await sb.from("orders").insert({
    order_number: orderNumber as string,
    customer_name: p.name,
    customer_email: p.email || "",
    customer_phone: p.phone,
    shipping_address: {},
    payment_method: "bank_transfer",
    subtotal: 0,
    shipping_cost: 0,
    total_amount: 0,
    customer_notes: `[${p.kind}] ${p.details}`,
    status: "pending",
  });
  if (error) return NextResponse.json({ error: "server" }, { status: 500 });
  return NextResponse.json({ ok: true, orderNumber });
}
