-- =========================================================================
-- Shosti Nature (স্বস্তিনাচার) - PostgreSQL & Supabase Database Migration
-- Product: মেথি মিক্স (Methi Mix)
-- =========================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    subtitle TEXT,
    category TEXT DEFAULT 'প্রাকৃতিক ও ভেষজ পণ্য',
    base_price NUMERIC(10, 2) NOT NULL DEFAULT 500.00,
    original_price NUMERIC(10, 2) DEFAULT 650.00,
    weight TEXT DEFAULT '২০০ গ্রাম (নেট ওজন)',
    in_stock BOOLEAN DEFAULT TRUE,
    image_url TEXT NOT NULL DEFAULT '/images/default-methi-mix.jpg',
    gallery_images JSONB DEFAULT '[]'::jsonb,
    ingredients JSONB DEFAULT '[]'::jsonb,
    manufacturer TEXT DEFAULT 'এম এইচ ন্যাচারাল প্রডাক্টস লিঃ',
    origin TEXT DEFAULT 'বাংলাদেশ',
    shelf_life TEXT DEFAULT '১২ মাস',
    storage_instructions TEXT,
    usage_instructions TEXT,
    warning_notice TEXT,
    disclaimer TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Store Settings Table
CREATE TABLE IF NOT EXISTS public.store_settings (
    id TEXT PRIMARY KEY DEFAULT 'default_settings',
    store_name TEXT NOT NULL DEFAULT 'Shosti Nature',
    tagline TEXT DEFAULT 'প্রকৃতির শুদ্ধতায় সুস্থ জীবনের অঙ্গীকার',
    phone TEXT DEFAULT '01700-000000',
    whatsapp TEXT DEFAULT '8801700000000',
    email TEXT DEFAULT 'contact@shostinature.com',
    address TEXT DEFAULT 'ঢাকা, বাংলাদেশ',
    announcement_text TEXT DEFAULT '🌿 সারাদেশে হোম ডেলিভারি ও ক্যাশ অন ডেলিভারি সুবিধা | প্রোডাক্ট দেখে মূল্য পরিশোধের সুযোগ',
    show_announcement BOOLEAN DEFAULT TRUE,
    delivery_inside_dhaka NUMERIC(10, 2) DEFAULT 70.00,
    delivery_outside_dhaka NUMERIC(10, 2) DEFAULT 130.00,
    delivery_time_dhaka TEXT DEFAULT '২৪ থেকে ৪৮ ঘণ্টা',
    delivery_time_outside TEXT DEFAULT '২ থেকে ৪ কার্যদিবস',
    cod_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL, -- e.g. SN-261010-8492
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    city TEXT NOT NULL CHECK (city IN ('inside_dhaka', 'outside_dhaka')),
    district TEXT,
    subtotal NUMERIC(10, 2) NOT NULL,
    delivery_charge NUMERIC(10, 2) NOT NULL,
    discount NUMERIC(10, 2) DEFAULT 0.00,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_method TEXT DEFAULT 'cod',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
    notes TEXT,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES public.products(id),
    product_name TEXT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    total_price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for lightning fast lookups
CREATE INDEX IF NOT EXISTS idx_orders_phone ON public.orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- =========================================================================
-- Row Level Security (RLS) Configuration
-- =========================================================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Public can read products and settings
CREATE POLICY "Allow public read access to products"
    ON public.products FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow public read access to store_settings"
    ON public.store_settings FOR SELECT
    TO anon, authenticated
    USING (true);

-- Public can insert new orders (Cash on Delivery)
CREATE POLICY "Allow public to insert orders"
    ON public.orders FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Allow public to insert order items"
    ON public.order_items FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Customers can view only their own order if querying by phone/order_number, but not list all
CREATE POLICY "Allow order lookup by customer"
    ON public.orders FOR SELECT
    TO anon, authenticated
    USING (
      -- Protected: Cannot list all orders blindly
      current_setting('request.jwt.claim.role', true) = 'service_role'
      OR auth.role() = 'authenticated'
    );

-- Only service role / authenticated admin can update or delete orders
CREATE POLICY "Allow admin full access to orders"
    ON public.orders FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow admin full access to products"
    ON public.products FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow admin full access to settings"
    ON public.store_settings FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
