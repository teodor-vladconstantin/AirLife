import { NextResponse } from "next/server";
import { z } from "zod";
import { adminDb } from "@/lib/email/db";
import { authorized } from "@/lib/email/send";

const schema = z.object({
  email: z.string().trim().toLowerCase().email(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // day the service was done
  productType: z.string().max(80).optional(), // e.g. "aer condiționat 12000 BTU"
});

// Records when a customer's last service was done, so the daily cron can send the 11-month reminder.
// Only touches people who already confirmed their subscription: we never add someone to the list from here.
// Usage: curl -X POST $SITE/api/admin/service-date -H "Authorization: Bearer $CRON_SECRET" \
//   -d '{"email":"client@example.com","date":"2026-11-10","productType":"Aer condiționat"}'
export async function POST(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const { email, date, productType } = parsed.data;

  const { data, error } = await adminDb()
    .from("subscribers")
    .update({ last_service_date: date, product_type: productType ?? null })
    .eq("email", email)
    .eq("status", "active")
    .select("id");
  if (error) return NextResponse.json({ error: "server" }, { status: 500 });
  // 0 means: not subscribed (or not confirmed). Nothing is created, on purpose.
  return NextResponse.json({ updated: data.length });
}
