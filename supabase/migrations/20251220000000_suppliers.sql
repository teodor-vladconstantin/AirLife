-- Suppliers module (admin only): who each product comes from, contract markup, purchase and list prices.
-- Prices live in their own tables, NOT on public.products: products is readable by every visitor (the shop), these are not.

CREATE TABLE IF NOT EXISTS public.suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE CHECK (char_length(name) BETWEEN 2 AND 120),
  contact_name text,
  contact_email text,
  contact_phone text,
  website text,
  default_markup_percent numeric(6,2) CHECK (default_markup_percent IS NULL OR default_markup_percent >= 0), -- contract markup on the purchase price
  offer_label text,            -- e.g. "Listă de preț 2026"
  offer_url text,              -- link to the price offer (PDF, sheet…)
  offer_valid_until date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.supplier_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  supplier_sku text,
  purchase_price numeric(10,2) CHECK (purchase_price IS NULL OR purchase_price >= 0),  -- what we pay the supplier
  list_price numeric(10,2) CHECK (list_price IS NULL OR list_price >= 0),              -- the supplier's list price
  markup_percent numeric(6,2) CHECK (markup_percent IS NULL OR markup_percent >= 0),   -- contract markup for this product; NULL = supplier default
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (supplier_id, product_id)
);
CREATE INDEX IF NOT EXISTS supplier_products_product_idx ON public.supplier_products (product_id);

ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage suppliers" ON public.suppliers FOR ALL
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage supplier products" ON public.supplier_products FOR ALL
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Seed: the 673 products imported from ecovent.ro on 2026-11-24 belong to Ecovent, the products that already existed
-- (created 2026-11-12) belong to Novingair. Prices and markup are filled in from the admin.
INSERT INTO public.suppliers (name, website) VALUES ('Ecovent', 'https://ecovent.ro'), ('Novingair', NULL)
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.supplier_products (supplier_id, product_id, supplier_sku)
SELECT s.id, p.id, p.sku
FROM public.products p
JOIN public.suppliers s ON s.name = CASE WHEN p.created_at >= DATE '2026-11-20' THEN 'Ecovent' ELSE 'Novingair' END
ON CONFLICT (supplier_id, product_id) DO NOTHING;
