import { NextResponse } from "next/server";
import { render } from "@react-email/components";
import { z } from "zod";
import { resend, NEWS_FROM, REPLY_TO } from "@/lib/email/client";
import { adminDb, siteUrl } from "@/lib/email/db";
import { CONSENT_TEXT } from "@/lib/email/consent";
import { unsubscribeHeaders } from "@/lib/email/headers";
import Confirm from "@/emails/Confirm";

const schema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  consent: z.literal(true), // explicit checkbox, not pre-ticked
  website: z.string().optional(), // honeypot
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
  const { email, website, source } = parsed.data;
  if (website) return ok(); // bot: pretend success

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (limited(`ip:${ip}`, 5, 10 * 60_000)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  // One confirmation mail per address per 5 minutes, so the form can't be used to spam someone's inbox.
  if (limited(`email:${email}`, 1, 5 * 60_000)) return ok();

  const db = adminDb();
  const { data: row, error: readError } = await db
    .from("subscribers")
    .select("status, unsubscribe_token")
    .eq("email", email)
    .maybeSingle();
  if (readError) return NextResponse.json({ error: "server" }, { status: 500 });

  let token: string;
  if (!row) {
    const { data, error } = await db
      .from("subscribers")
      .insert({ email, source, consent_text: CONSENT_TEXT })
      .select("unsubscribe_token")
      .single();
    if (error) return NextResponse.json({ error: "server" }, { status: 500 });
    token = data.unsubscribe_token;
  } else if (["active", "bounced", "complained"].includes(row.status)) {
    return ok(); // same answer for every case so the form can't reveal who is subscribed
  } else {
    if (row.status === "unsubscribed") {
      await db.from("subscribers").update({ status: "pending", consent_at: null, consent_text: CONSENT_TEXT }).eq("email", email);
    }
    token = row.unsubscribe_token;
  }

  const base = siteUrl();
  const element = Confirm({ confirmUrl: `${base}/confirm?token=${token}`, unsubscribeUrl: `${base}/unsubscribe?token=${token}` });
  const { error } = await resend.emails.send({
    from: NEWS_FROM,
    to: email,
    replyTo: REPLY_TO,
    headers: unsubscribeHeaders(token),
    subject: "Confirmă abonarea la AirLife",
    html: await render(element),
    text: await render(element, { plainText: true }),
  });
  if (error) return NextResponse.json({ error: "email_failed" }, { status: 502 });
  return ok();
}
