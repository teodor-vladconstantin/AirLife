import { NextResponse } from "next/server";
import { z } from "zod";
import { adminDb } from "@/lib/email/db";

const uuid = z.string().uuid();

// Serves two callers: the /unsubscribe page button (JSON body) and mail clients doing RFC 8058
// one-click unsubscribe (POST to the URL in the List-Unsubscribe header, token in the query string).
export async function POST(req: Request) {
  const fromQuery = new URL(req.url).searchParams.get("token");
  const fromBody = await req.json().then((b) => b?.token).catch(() => null);
  const parsed = uuid.safeParse(fromQuery ?? fromBody);
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });

  // Only pending/active rows change: a bounced or complained address must never be put back in play.
  const { data, error } = await adminDb()
    .from("subscribers")
    .update({ status: "unsubscribed" })
    .eq("unsubscribe_token", parsed.data)
    .in("status", ["pending", "active"])
    .select("id");
  if (error) return NextResponse.json({ error: "server" }, { status: 500 });
  // Tokens of the other lists: stock/price alerts are deleted, cart reminders are closed.
  if (data.length === 0) {
    const sb = adminDb();
    const a = await sb.from("stock_alerts").delete().eq("unsubscribe_token", parsed.data).select("id");
    const c = await sb.from("abandoned_carts").update({ recovered_at: new Date().toISOString() }).eq("unsubscribe_token", parsed.data).is("recovered_at", null).select("id");
    if (a.data?.length || c.data?.length) return NextResponse.json({ ok: true });
  }
  if (data.length === 0) {
    const { data: row } = await adminDb().from("subscribers").select("status").eq("unsubscribe_token", parsed.data).maybeSingle();
    if (row?.status !== "unsubscribed") return NextResponse.json({ error: "invalid" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
