import { NextResponse } from "next/server";
import { z } from "zod";
import { render } from "@react-email/components";
import { adminDb, siteUrl } from "@/lib/email/db";
import { sendMany, type Msg } from "@/lib/email/send";
import Newsletter, { type NewsletterData } from "@/emails/Newsletter";

export const runtime = "nodejs";

const path = z.string().regex(/^\/(?!\/)[A-Za-z0-9\-_/?=&%#.]*$/, "path");
const schema = z.object({
  action: z.enum(["preview", "count", "test", "send"]),
  subject: z.string().trim().min(3).max(150),
  preheader: z.string().trim().max(200).default(""),
  headline: z.string().trim().min(3).max(150),
  body: z.string().trim().min(1).max(5000),
  ctaLabel: z.string().trim().max(60).optional(),
  ctaPath: path.max(200).optional(),
  productIds: z.array(z.string().uuid()).max(6).default([]),
});

// Campaign editor backend. Only a signed-in admin may call it. "send" goes to every active subscriber (opt-in confirmed);
// each recipient gets a personal unsubscribe link and the List-Unsubscribe headers.
export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const db = adminDb();
  const { data: u } = await db.auth.getUser(token);
  if (!u.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { data: isAdmin } = await db.rpc("has_role", { _user_id: u.user.id, _role: "admin" });
  if (!isAdmin) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (!parsed.success) return NextResponse.json({ error: "invalid", fields: parsed.error.issues.map((i) => i.path.join(".")) }, { status: 400 });
  const f = parsed.data;

  if (f.action === "count") {
    const { count } = await db.from("subscribers").select("id", { count: "exact", head: true }).eq("status", "active");
    return NextResponse.json({ recipients: count ?? 0 });
  }

  const { data: rows } = f.productIds.length
    ? await db.from("products").select("id, name, slug, price, sale_price, sale_ends_at, image_url, stock, hidden").in("id", f.productIds)
    : { data: [] as never[] };
  const products = f.productIds.flatMap((id) => {
    const p = (rows ?? []).find((r: { id: string }) => r.id === id) as { name: string; slug: string | null; price: number; sale_price: number | null; sale_ends_at: string | null; image_url: string | null; hidden: boolean } | undefined;
    if (!p || p.hidden || !p.slug || !p.image_url) return [];
    const sale = p.sale_price != null && p.sale_price > 0 && p.sale_price < p.price && (!p.sale_ends_at || new Date(p.sale_ends_at).getTime() > Date.now());
    return [{ name: p.name, slug: p.slug, price: Number(sale ? p.sale_price : p.price), image_url: p.image_url }];
  });
  const data: NewsletterData = {
    preheader: f.preheader, headline: f.headline, body: f.body, ctaLabel: f.ctaLabel, ctaPath: f.ctaPath, products,
    campaign: `newsletter-${new Date().toISOString().slice(0, 10)}`,
  };

  if (f.action === "preview") {
    return NextResponse.json({ html: await render(Newsletter({ d: data })), products: products.length });
  }

  const to = f.action === "test"
    ? [{ id: "test", email: u.user.email!, unsubscribe_token: crypto.randomUUID() }]
    : ((await db.from("subscribers").select("id, email, unsubscribe_token").eq("status", "active")).data ?? []);
  if (!to.length) return NextResponse.json({ error: "no_recipients" }, { status: 409 });

  const msgs: Msg[] = to.map((s) => ({
    id: s.id, to: s.email, token: s.unsubscribe_token, subject: f.action === "test" ? `[TEST] ${f.subject}` : f.subject,
    element: Newsletter({ d: data, unsubscribeUrl: `${siteUrl()}/unsubscribe?token=${s.unsubscribe_token}` }),
  }));
  const res = await sendMany(msgs, `news-${f.action}-${Date.now()}`);
  return NextResponse.json({ sent: res.sent, failed: res.failedIds.length });
}
