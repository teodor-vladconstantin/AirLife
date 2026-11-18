-- Sale prices, product visibility and marketing campaigns (site banner). Apply in the Supabase SQL editor.
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS sale_price numeric(10,2),
  ADD COLUMN IF NOT EXISTS sale_ends_at timestamptz,
  ADD COLUMN IF NOT EXISTS hidden boolean NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS public.campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,                 -- internal name, also the default utm_campaign
  headline text NOT NULL,             -- text shown in the site banner
  body text,
  cta_label text,
  cta_url text,                       -- path on the site, e.g. /aer-conditionat
  utm_campaign text,
  starts_at timestamptz NOT NULL DEFAULT now(),
  ends_at timestamptz,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view live campaigns"
  ON public.campaigns FOR SELECT
  TO anon, authenticated
  USING (active AND starts_at <= now() AND (ends_at IS NULL OR ends_at > now()));

CREATE POLICY "Admins manage campaigns"
  ON public.campaigns FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
