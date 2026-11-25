import { NextResponse } from "next/server";
import { z } from "zod";
import { adminDb } from "@/lib/email/db";
import { CONSENT_TEXT } from "@/lib/email/consent";
import { verifyTurnstile } from "@/lib/turnstile";

const schema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  consent: z.literal(true), // explicit checkbox, not pre-ticked
  website: z.string().optional(), // honeypot
  captcha: z.string().optional(), // Turnstile
  source: z.string().max(50).default("site"),
});

// ponytail: in-memory limiter. Resets per serverless instance, so it only blunts casual abuse.
// Upgrade to Upstash/Vercel KV if bots show up in the subscribers table.
const hits = new Map<string, number[]>();
function limited(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  const over = recent.length >= max;
  if (!over) recent.push(now);
  hits.set(key, recent);
  return over;
}

const ok = () => NextResponse.json({ ok: true });

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const { email, website, source, captcha } = parsed.data;
  if (website) return ok(); // bot: pretend success

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (limited(`ip:${ip}`, 5, 10 * 60_000)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  if (!(await verifyTurnstile(captcha, ip))) return NextResponse.json({ error: "captcha" }, { status: 403 });

  const db = adminDb();
  const { data: row, error: readError } = await db
    .from("subscribers")
    .select("status, unsubscribe_token")
    .eq("email", email)
    .maybeSingle();
  if (readError) return NextResponse.json({ error: "server" }, { status: 500 });

  const now = new Date().toISOString();
  if (!row) {
    const { error } = await db.from("subscribers").insert({ email, source, consent_text: CONSENT_TEXT, status: "active", consent_at: now });
    if (error) return NextResponse.json({ error: "server" }, { status: 500 });
  } else if (row.status === "pending" || row.status === "unsubscribed") {
    // single opt-in: the ticked consent checkbox is the consent, no confirmation mail
    const { error } = await db.from("subscribers").update({ status: "active", consent_at: now, consent_text: CONSENT_TEXT }).eq("email", email);
    if (error) return NextResponse.json({ error: "server" }, { status: 500 });
  }
  return ok(); // same answer for every case so the form can't reveal who is subscribed
}
