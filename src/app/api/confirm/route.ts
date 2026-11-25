import { NextResponse } from "next/server";
import { z } from "zod";
import { adminDb, siteUrl } from "@/lib/email/db";
import { sendMany } from "@/lib/email/send";
import Welcome, { welcomeSubject } from "@/emails/Welcome";

const schema = z.object({ token: z.string().uuid() });

// Activation is a POST on purpose: email security scanners prefetch links with GET,
// which would otherwise confirm people who never clicked.
export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const { token } = parsed.data;

  const db = adminDb();
  const { data: row } = await db.from("subscribers").select("status").eq("unsubscribe_token", token).maybeSingle();
  if (row?.status === "active") return NextResponse.json({ ok: true }); // double click is fine
  if (row?.status !== "pending") return NextResponse.json({ error: "invalid" }, { status: 404 });

  // The status filter makes this the claim: only one concurrent request gets a row back, so only one welcome is sent.
  const { data, error } = await db
    .from("subscribers")
    .update({ status: "active", consent_at: new Date().toISOString(), welcome_sent_at: new Date().toISOString() })
    .eq("unsubscribe_token", token)
    .eq("status", "pending")
    .select("id, email");
  if (error) return NextResponse.json({ error: "server" }, { status: 500 });

  // Welcome day 0. A failed send must not fail the confirmation: the person is subscribed either way.
  if (data?.[0]) {
    const { id, email } = data[0];
    const { failedIds } = await sendMany(
      [{ id, to: email, token, subject: welcomeSubject(0), element: Welcome({ day: 0, unsubscribeUrl: `${siteUrl()}/unsubscribe?token=${token}` }) }],
      `welcome0-${id}`,
    ).catch(() => ({ failedIds: [id] }));
    if (failedIds.length) await db.from("subscribers").update({ welcome_sent_at: null }).eq("id", id);
  }
  return NextResponse.json({ ok: true });
}
