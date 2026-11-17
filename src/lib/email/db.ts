import { createClient } from "@supabase/supabase-js";

// Server-only: the service-role key bypasses RLS, so never import this from a client component.
// Untyped on purpose: `subscribers` is not in the generated Database types.
export const adminDb = () =>
  createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

// Where links in emails point. Set NEXT_PUBLIC_SITE_URL=http://localhost:8080 in .env.local to test locally.
// Deliberately not read from the request Host header: a forged Host would put an attacker's domain in the email.
export const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL ?? "https://airlife.ro";
