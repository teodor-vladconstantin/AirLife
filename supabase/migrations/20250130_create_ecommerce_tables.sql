-- Green AirLife E-Commerce Tables Migration
-- Created: 2025-01-30
-- Description: Tables for cart, orders, order items, and shipping settings

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE public.order_status AS ENUM (
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled'
);

CREATE TYPE public.payment_method AS ENUM (
  'cash_on_delivery',
  'bank_transfer',
  'card_online'
);

CREATE TYPE public.payment_status AS ENUM (
  'unpaid',
  'paid',
  'refunded'
);

-- ============================================
-- TABLE: cart_items
-- ============================================

CREATE TABLE public.cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  quantity integer NOT NULL CHECK (quantity > 0),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, product_id)
);

CREATE INDEX idx_cart_items_user_id ON public.cart_items(user_id);
CREATE INDEX idx_cart_items_product_id ON public.cart_items(product_id);

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own cart"
  ON public.cart_items FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER on_cart_item_updated
  BEFORE UPDATE ON public.cart_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- TABLE: orders
-- ============================================

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  user_id uuid REFERENCES auth.users(id),

  -- Status
  status public.order_status DEFAULT 'pending' NOT NULL,
  payment_method public.payment_method NOT NULL,
  payment_status public.payment_status DEFAULT 'unpaid' NOT NULL,

  -- Customer info (snapshot pentru persistență)
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,

  -- Shipping address
  shipping_address jsonb NOT NULL,

  -- Amounts
  subtotal decimal(10,2) NOT NULL,
  shipping_cost decimal(10,2) DEFAULT 0 NOT NULL,
  total_amount decimal(10,2) NOT NULL,

  -- Delivery info
  tracking_number text,
  courier text,

  -- Notes
  customer_notes text,
  admin_notes text,

  -- Timestamps
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  confirmed_at timestamptz,
  shipped_at timestamptz,
  delivered_at timestamptz
);

CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX idx_orders_order_number ON public.orders(order_number);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update orders"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER on_order_updated
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- TABLE: order_items
-- ============================================

CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES public.products(id),

  -- Snapshot data (pentru persistență)
  product_name text NOT NULL,
  product_category text NOT NULL,
  product_image_url text,

  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price decimal(10,2) NOT NULL,
  total_price decimal(10,2) NOT NULL,

  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_order_items_product_id ON public.order_items(product_id);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items"
  ON public.order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all order items"
  ON public.order_items FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- TABLE: shipping_settings
-- ============================================

CREATE TABLE public.shipping_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  flat_rate decimal(10,2) NOT NULL DEFAULT 20.00,
  free_shipping_threshold decimal(10,2) DEFAULT 500.00,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.shipping_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view shipping settings"
  ON public.shipping_settings FOR SELECT
  TO authenticated, anon
  USING (is_active = true);

CREATE POLICY "Admins can manage shipping settings"
  ON public.shipping_settings FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Insert default shipping settings
INSERT INTO public.shipping_settings (name, flat_rate, free_shipping_threshold)
VALUES ('Default', 20.00, 500.00);

CREATE TRIGGER on_shipping_settings_updated
  BEFORE UPDATE ON public.shipping_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- FUNCTIONS
-- ============================================

-- Sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

-- Function to generate order number
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  next_number integer;
  order_num text;
BEGIN
  next_number := nextval('order_number_seq');
  order_num := 'AL' || LPAD(next_number::text, 6, '0');
  RETURN order_num;
END;
$$;

-- Function to decrease product stock
CREATE OR REPLACE FUNCTION public.decrease_product_stock(
  p_product_id uuid,
  p_quantity integer
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_stock integer;
BEGIN
  -- Get current stock with row lock
  SELECT stock INTO current_stock
  FROM public.products
  WHERE id = p_product_id
  FOR UPDATE;

  -- Check if enough stock
  IF current_stock IS NULL OR current_stock < p_quantity THEN
    RETURN false;
  END IF;

  -- Decrease stock
  UPDATE public.products
  SET stock = stock - p_quantity,
      updated_at = now()
  WHERE id = p_product_id;

  RETURN true;
END;
$$;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
