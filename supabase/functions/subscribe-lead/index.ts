// Saves an email lead and sends the lead magnet through Resend.
// Secrets: RESEND_API_KEY (set with `supabase secrets set`); SUPABASE_* are injected by the platform.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const FROM = "AirLife <contact@airlife.ro>";
const SITE = "https://airlife.ro";

// ponytail: one-file magnet registry, move to a table when there are more than a handful
const MAGNETS: Record<string, { subject: string; path: string; title: string }> = {
  "checklist-intretinere-ac": {
    subject: "Checklist-ul tău de întreținere pentru aer condiționat",
    path: "/lead-magnets/checklist-intretinere-ac.pdf",
    title: "Checklist întreținere aer condiționat",
  },
};

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const { email, magnet, source, website } = await req.json().catch(() => ({}));
  if (website) return json({ ok: true }); // honeypot: bots fill the hidden field
  const addr = String(email ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(addr) || addr.length > 254) return json({ error: "invalid_email" }, 400);
  const m = MAGNETS[String(magnet ?? "")];
  if (!m) return json({ error: "unknown_magnet" }, 400);

  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { error: dbError } = await db
    .from("leads")
    .upsert({ email: addr, magnet, source: source ?? "site" }, { onConflict: "email" });
  if (dbError) return json({ error: "db_error" }, 500);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: FROM,
      to: addr,
      reply_to: "contact@airlife.ro",
      subject: m.subject,
      html: `<p>Bună!</p><p>Mulțumim că ești alături de AirLife. Aici ai <a href="${SITE}${m.path}">${m.title}</a>.</p>
<p>Ai nevoie de igienizare sau service în Buzău? Sună-ne la <a href="tel:+40722153525">+40 722 15 35 25</a>.</p>
<p style="color:#888;font-size:12px">Nu mai vrei emailuri? Răspunde cu „STOP”.</p>`,
    }),
  });
  if (!res.ok) return json({ error: "email_failed" }, 502);
  return json({ ok: true });
});
