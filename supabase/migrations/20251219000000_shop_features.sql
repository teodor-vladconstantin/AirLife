-- Store features: account wishlist, product reviews, discount codes, abandoned carts, stock/price alerts,
-- and dropshipping fields on orders. Every table has RLS on. Tables written by the server (service role)
-- have no public policies; the app degrades gracefully while this migration has not been run.

-- ---------------------------------------------------------------------------------------------------------------
-- Wishlist (per customer account)
-- ---------------------------------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.wishlist_items (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, product_id)
);
CREATE INDEX IF NOT EXISTS wishlist_items_product_idx ON public.wishlist_items (product_id);
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers read own wishlist" ON public.wishlist_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Customers add to own wishlist" ON public.wishlist_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Customers remove from own wishlist" ON public.wishlist_items FOR DELETE USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------------------------------------------
-- Product reviews (written through /api/reviews; shown only when approved)
-- ---------------------------------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name text NOT NULL CHECK (char_length(author_name) BETWEEN 2 AND 80),
  rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title text CHECK (title IS NULL OR char_length(title) <= 120),
  body text NOT NULL CHECK (char_length(body) BETWEEN 10 AND 2000),
  verified_purchase boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_id, user_id)
);
CREATE INDEX IF NOT EXISTS product_reviews_product_status_idx ON public.product_reviews (product_id, status);
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone reads approved reviews" ON public.product_reviews FOR SELECT USING (status = 'approved');
CREATE POLICY "Admins manage reviews" ON public.product_reviews FOR ALL
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ---------------------------------------------------------------------------------------------------------------
-- Discount codes (validated server side in /api/checkout and /api/discount)
-- ---------------------------------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.discount_codes (
  code text PRIMARY KEY CHECK (code = upper(code) AND char_length(code) BETWEEN 3 AND 32),
  kind text NOT NULL CHECK (kind IN ('percent', 'fixed')),
  value numeric(10,2) NOT NULL CHECK (value > 0),
  min_order numeric(10,2) NOT NULL DEFAULT 0 CHECK (min_order >= 0),
  starts_at timestamptz,
  ends_at timestamptz,
  max_uses integer CHECK (max_uses IS NULL OR max_uses > 0),
  used_count integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (kind <> 'percent' OR value <= 100)
);
ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage discount codes" ON public.discount_codes FOR ALL
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ---------------------------------------------------------------------------------------------------------------
-- Orders: discount and dropshipping fields (the order is forwarded to the supplier by hand or by an integration)
-- ---------------------------------------------------------------------------------------------------------------
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS discount_code text,
  ADD COLUMN IF NOT EXISTS discount_amount numeric(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS supplier_name text,
  ADD COLUMN IF NOT EXISTS supplier_order_ref text,
  ADD COLUMN IF NOT EXISTS supplier_status text NOT NULL DEFAULT 'new'
    CHECK (supplier_status IN ('new', 'ordered', 'shipped', 'delivered', 'problem')),
  ADD COLUMN IF NOT EXISTS supplier_ordered_at timestamptz,
  ADD COLUMN IF NOT EXISTS review_request_sent_at timestamptz;

-- ---------------------------------------------------------------------------------------------------------------
-- Abandoned carts (saved by /api/cart-recovery for logged-in customers and subscribers who left a cart)
-- ---------------------------------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.abandoned_carts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL CHECK (email = lower(email)),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  items jsonb NOT NULL,
  total numeric(10,2) NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  reminder1_sent_at timestamptz,
  reminder2_sent_at timestamptz,
  recovered_at timestamptz,
  unsubscribe_token uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE
);
CREATE UNIQUE INDEX IF NOT EXISTS abandoned_carts_email_open_idx ON public.abandoned_carts (email) WHERE recovered_at IS NULL;
ALTER TABLE public.abandoned_carts ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------------------------------------------
-- Back-in-stock and price-drop alerts (customers with the product in their wishlist, or who asked on the product page)
-- ---------------------------------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.stock_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL CHECK (email = lower(email)),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('back_in_stock', 'price_drop')),
  price_at_signup numeric(10,2),
  created_at timestamptz NOT NULL DEFAULT now(),
  notified_at timestamptz,
  unsubscribe_token uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  UNIQUE (email, product_id, kind)
);
CREATE INDEX IF NOT EXISTS stock_alerts_open_idx ON public.stock_alerts (product_id) WHERE notified_at IS NULL;
ALTER TABLE public.stock_alerts ENABLE ROW LEVEL SECURITY;
