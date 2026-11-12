-- Catalog fields for SEO product pages. slug is the public URL (/products/<slug>).
ALTER TABLE public.products
  ADD COLUMN slug text UNIQUE,
  ADD COLUMN sku text,
  ADD COLUMN brand text,
  ADD COLUMN gallery text[] NOT NULL DEFAULT '{}',
  ADD COLUMN specs jsonb NOT NULL DEFAULT '{}'::jsonb;

CREATE INDEX products_category_idx ON public.products (category);
