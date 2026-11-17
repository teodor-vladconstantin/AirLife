import { NextResponse } from "next/server";
import { resend } from "@/lib/email/client";
import { adminDb } from "@/lib/email/db";

// Resend signs every webhook (Svix). We verify the signature on the RAW body before trusting anything.
export async function POST(req: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "not_configured" }, { status: 500 });

  const payload = await req.text();
  let event;
  try {
    event = resend.webhooks.verify({
      payload,
      headers: {
        id: req.headers.get("svix-id") ?? "",
        timestamp: req.headers.get("svix-timestamp") ?? "",
        signature: req.headers.get("svix-signature") ?? "",
      },
      webhookSecret: secret,
    });
  } catch {
    return NextResponse.json({ error: "bad_signature" }, { status: 400 });
  }

  let status: "bounced" | "complained" | null = null;
  if (event.type === "email.complained") status = "complained";
  // Only hard bounces suppress. A transient bounce (full mailbox) is retried by Resend and may recover.
  if (event.type === "email.bounced" && event.data.bounce.type.toLowerCase() === "permanent") status = "bounced";

  if (status) {
    const emails = event.data.to.map((e) => e.trim().toLowerCase());
    const { error } = await adminDb().from("subscribers").update({ status }).in("email", emails).neq("status", "complained");
    if (error) return NextResponse.json({ error: "server" }, { status: 500 }); // Resend retries on non-2xx
  }
  return NextResponse.json({ ok: true });
}
