import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { sendOrderEmail } from "@/lib/email/order";

export const runtime = "nodejs";

const body = z.object({ orderId: z.string().uuid(), kind: z.enum(["processing", "shipped", "delivered", "cancelled"]) });

// Called by the admin dashboard after it saves a status change: emails the customer. Only logged-in admins may call it.
export async function POST(req: Request) {
  const parsed = body.safeParse(await req.json().catch(() => null));
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!parsed.success || !token) return NextResponse.json({ error: "invalid" }, { status: 400 });

  const sb = createClient(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
  const { data: u } = await sb.auth.getUser(token);
  if (!u.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { data: isAdmin } = await sb.rpc("has_role", { _user_id: u.user.id, _role: "admin" });
  if (!isAdmin) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  await sendOrderEmail(parsed.data.orderId, parsed.data.kind);
  return NextResponse.json({ ok: true });
}
