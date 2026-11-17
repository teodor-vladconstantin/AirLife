import type { Metadata } from "next";
import { adminDb } from "@/lib/email/db";
import Unsubscribe from "@/views/Unsubscribe";

export const metadata: Metadata = { title: "Dezabonare | AirLife", robots: { index: false } };
export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// GET only reads. The button POSTs to /api/unsubscribe, so link scanners can't unsubscribe anyone.
export default async function Page({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  let initial: "ask" | "done" | "invalid" = "invalid";
  if (token && UUID.test(token)) {
    const { data } = await adminDb().from("subscribers").select("status").eq("unsubscribe_token", token).maybeSingle();
    if (data?.status === "pending" || data?.status === "active") initial = "ask";
    else if (data?.status) initial = "done"; // already unsubscribed, bounced or complained: nothing more to send
  }
  return <Unsubscribe token={token ?? ""} initial={initial} />;
}
