import type { SupabaseClient } from "@supabase/supabase-js";

export type DiscountResult =
  | { ok: true; code: string; amount: number }
  | { ok: false; reason: "not_found" | "inactive" | "not_started" | "expired" | "used_up" | "min_order"; min?: number };

export const normalizeCode = (raw: string) => raw.trim().toUpperCase().replace(/\s+/g, "");

// Checks a discount code against the cart subtotal (server side only; the browser never decides the amount).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function evaluateDiscount(sb: SupabaseClient<any, "public", any>, raw: string, subtotal: number): Promise<DiscountResult> {
  const code = normalizeCode(raw);
  if (!code) return { ok: false, reason: "not_found" };
  const { data: d, error } = await sb.from("discount_codes").select("*").eq("code", code).maybeSingle();
  if (error || !d) return { ok: false, reason: "not_found" };
  const now = Date.now();
  if (!d.active) return { ok: false, reason: "inactive" };
  if (d.starts_at && new Date(d.starts_at).getTime() > now) return { ok: false, reason: "not_started" };
  if (d.ends_at && new Date(d.ends_at).getTime() < now) return { ok: false, reason: "expired" };
  if (d.max_uses != null && d.used_count >= d.max_uses) return { ok: false, reason: "used_up" };
  const min = Number(d.min_order ?? 0);
  if (subtotal < min) return { ok: false, reason: "min_order", min };
  const value = Number(d.value);
  const raw$ = d.kind === "percent" ? (subtotal * value) / 100 : value;
  const amount = Math.round(Math.min(raw$, subtotal) * 100) / 100;
  return amount > 0 ? { ok: true, code, amount } : { ok: false, reason: "not_found" };
}
