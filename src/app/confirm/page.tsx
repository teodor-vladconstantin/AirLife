import type { Metadata } from "next";
import { adminDb } from "@/lib/email/db";
import Confirm from "@/views/Confirm";

export const metadata: Metadata = { title: "Confirmare abonare | AirLife", robots: { index: false } };
export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// GET only reads. The subscriber is activated by the button, which POSTs to /api/confirm.
export default async function Page({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  let initial: "ask" | "done" | "invalid" = "invalid";
  if (token && UUID.test(token)) {
    const { data } = await adminDb().from("subscribers").select("status").eq("unsubscribe_token", token).maybeSingle();
    if (data?.status === "pending") initial = "ask";
    else if (data?.status === "active") initial = "done";
  }
  return <Confirm token={token ?? ""} initial={initial} />;
}
