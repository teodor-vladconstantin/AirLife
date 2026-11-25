-- Marketing subscribers (double opt-in). Written only by Next route handlers with the service role.
CREATE TABLE public.subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE CHECK (email = lower(email)),
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'active', 'unsubscribed', 'bounced', 'complained')),
  source text NOT NULL DEFAULT 'site',
  consent_at timestamptz,          -- set on confirmation, not on form submit
  consent_text text,               -- exact wording the person agreed to
  unsubscribe_token uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  last_service_date date,          -- optional: drives the 11-12 month service reminder
  product_type text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX subscribers_status_idx ON public.subscribers (status);

ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view subscribers"
  ON public.subscribers FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));
