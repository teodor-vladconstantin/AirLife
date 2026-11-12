-- Email leads from lead magnets. Written only by the subscribe-lead edge function (service role).
CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  source text NOT NULL DEFAULT 'site',
  magnet text,
  created_at timestamptz NOT NULL DEFAULT now(),
  unsubscribed_at timestamptz
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view leads"
  ON public.leads FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));
