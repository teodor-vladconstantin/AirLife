import { NextResponse } from "next/server";
import { z } from "zod";
import { isShopVisible, salePricing } from "@/lib/pricing";
import { adminDb } from "@/lib/email/db";

export const runtime = "nodejs";

const body = z.object({ items: z.array(z.object({ id: z.string().uuid(), quantity: z.number().int().min(1).max(20) })).max(50) });

// Remembers the cart of a signed-in customer so the daily job can send a reminder if no order follows.
// Prices come from the database, never from the browser. An empty cart closes the open record.
export async function POST(req: Request) {
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  const sb = adminDb();
  const bearer = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const user = bearer ? (await sb.auth.getUser(bearer)).data.user : null;
  const email = user?.email?.toLowerCase();
  if (!user || !email) return NextResponse.json({ ok: true, tracked: false }); // guests are not tracked

  if (parsed.data.items.length === 0) {
    await sb.from("abandoned_carts").update({ recovered_at: new Date().toISOString() }).eq("email", email).is("recovered_at", null);
    return NextResponse.json({ ok: true, tracked: false });
  }
  const { data: products } = await sb.from("products").select("*").in("id", parsed.data.items.map((i) => i.id));
  const lines = parsed.data.items.flatMap((it) => {
    const p = products?.find((x) => x.id === it.id);
    return p && isShopVisible(p) ? [{ id: p.id, name: p.name, slug: p.slug, image_url: p.image_url, quantity: it.quantity, price: salePricing(p).price }] : [];
  });
  if (!lines.length) return NextResponse.json({ ok: true, tracked: false });
  const total = Math.round(lines.reduce((s, l) => s + l.price * l.quantity, 0) * 100) / 100;

  const { data: open } = await sb.from("abandoned_carts").select("id, items").eq("email", email).is("recovered_at", null).maybeSingle();
  const same = open && JSON.stringify((open.items as typeof lines).map((l) => [l.id, l.quantity])) === JSON.stringify(lines.map((l) => [l.id, l.quantity]));
  if (open && same) return NextResponse.json({ ok: true, tracked: true });
  // a changed cart restarts the reminder clock
  const row = { email, user_id: user.id, items: lines, total, updated_at: new Date().toISOString(), reminder1_sent_at: null, reminder2_sent_at: null };
  const { error } = open ? await sb.from("abandoned_carts").update(row).eq("id", open.id) : await sb.from("abandoned_carts").insert(row);
  if (error) return NextResponse.json({ ok: true, tracked: false }); // table missing: carts are simply not tracked
  return NextResponse.json({ ok: true, tracked: true });
}
