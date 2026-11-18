// Contact and service requests go through /api/request (Cloudflare Turnstile + rate limit), which writes them
// to the orders table so they show up in admin > Comenzi.
export const submitRequest = async (kind: string, p: { name: string; phone: string; email?: string; details: string }, token?: string) => {
  const res = await fetch("/api/request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind, ...p, token }),
  });
  if (!res.ok) throw new Error(String(res.status));
  const out = (await res.json().catch(() => ({}))) as { orderNumber?: string };
  return out.orderNumber ?? "";
};
