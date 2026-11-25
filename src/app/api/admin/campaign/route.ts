import { NextResponse } from "next/server";
import { z } from "zod";
import { adminDb, siteUrl } from "@/lib/email/db";
import { authorized, sendMany, type Msg } from "@/lib/email/send";
import { CAMPAIGNS } from "@/lib/email/campaigns";
import Seasonal, { seasonalSubject } from "@/emails/Seasonal";

const schema = z.object({
  campaign: z.string(),
  send: z.boolean().default(false), // false = dry run: only counts recipients
  testTo: z.string().email().optional(), // send only to this address (uses a throwaway token)
});

// Usage: curl -X POST $SITE/api/admin/campaign -H "Authorization: Bearer $CRON_SECRET" \
//   -d '{"campaign":"sezon-iarna","send":true}'
export async function POST(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  const def = parsed.success ? CAMPAIGNS[parsed.data.campaign] : undefined;
  if (!parsed.success || !def) return NextResponse.json({ error: "invalid", campaigns: Object.keys(CAMPAIGNS) }, { status: 400 });
  const { campaign, send, testTo } = parsed.data;

  const db = adminDb();
  const { data: products } = await db
    .from("products")
    .select("name, slug, price, image_url")
    .eq("category", def.category)
    .gt("stock", 0)
    .not("slug", "is", null)
    .not("image_url", "is", null)
    .order("price")
    .limit(3);

  const { data: subs, error } = testTo
    ? { data: [{ id: "test", email: testTo, unsubscribe_token: crypto.randomUUID() }], error: null }
    : await db.from("subscribers").select("id, email, unsubscribe_token").eq("status", "active");
  if (error || !subs) return NextResponse.json({ error: "server" }, { status: 500 });
  if (!send) return NextResponse.json({ dryRun: true, recipients: subs.length, products: products?.length ?? 0 });

  const msgs: Msg[] = subs.map((s) => ({
    id: s.id,
    to: s.email,
    token: s.unsubscribe_token,
    subject: seasonalSubject(def.variant),
    element: Seasonal({
      variant: def.variant,
      products: (products ?? []).map((p) => ({ name: p.name, slug: p.slug!, price: Number(p.price), image_url: p.image_url! })),
      unsubscribeUrl: `${siteUrl()}/unsubscribe?token=${s.unsubscribe_token}`,
    }),
  }));
  const day = new Date().toISOString().slice(0, 10);
  const { sent, failedIds } = await sendMany(msgs, `${campaign}-${testTo ? "test-" : ""}${day}`);
  return NextResponse.json({ sent, failed: failedIds.length });
}
