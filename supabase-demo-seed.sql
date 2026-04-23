-- ============================================================================
-- TABLESERVE DEMO SEED SCRIPT
-- ============================================================================
-- This script initializes the "Demo Cafe" shared sandbox environment.
-- Run this in your Supabase SQL Editor.

-- 1. Create the Demo Restaurant
-- ============================================================================
-- We try to find the 'demo@example.com' user ID first. 
-- If it doesn't exist yet, we use the first available user as owner.
INSERT INTO public.restaurants (name, slug, owner_id)
SELECT 'Demo Cafe', 'demo-cafe', id
FROM auth.users
ORDER BY (email = 'demo@example.com') DESC, created_at ASC
LIMIT 1
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
RETURNING id;

-- Save the ID for later. Let's assume we can get it via subquery.
-- DO block to handle everything in one go
DO $$
DECLARE
    v_rest_id UUID;
    v_item_id UUID;
BEGIN
    SELECT id INTO v_rest_id FROM restaurants WHERE slug = 'demo-cafe';

    -- 2. Create Restaurant Config
    -- ============================================================================
    INSERT INTO public.config (restaurant_id, restaurant_name, tax_percentage, total_tables, categories)
    VALUES (v_rest_id, 'Demo Cafe', 8.5, 12, 'Appetizers,Main Course,Desserts,Beverages')
    ON CONFLICT (restaurant_id) DO UPDATE SET 
        restaurant_name = EXCLUDED.restaurant_name,
        categories = EXCLUDED.categories;

    -- 3. Seed Menu Items
    -- ============================================================================
    -- Clean up old demo items to avoid duplicates if re-running
    DELETE FROM public.menu WHERE restaurant_id = v_rest_id;

    -- Appetizers
    INSERT INTO public.menu (restaurant_id, name, description, price, category, food_type, available, image_url)
    VALUES 
    (v_rest_id, 'Truffle Fries', 'Crispy golden fries tossed in truffle oil and parmesan.', 8.99, 'Appetizers', 'veg', true, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=500&auto=format&fit=crop'),
    (v_rest_id, 'Bruschetta Trio', 'Tomato & Basil, Olive Tapenade, and Balsamic Onion.', 11.50, 'Appetizers', 'veg', true, 'https://images.unsplash.com/photo-1572656631137-7935297eff55?q=80&w=500&auto=format&fit=crop');

    -- Main Course
    INSERT INTO public.menu (restaurant_id, name, description, price, category, food_type, available, image_url)
    VALUES 
    (v_rest_id, 'Classic Margherita Pizza', 'San Marzano tomatoes, fresh mozzarella, and basil.', 14.00, 'Main Course', 'veg', true, 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=500&auto=format&fit=crop'),
    (v_rest_id, 'Wild Mushroom Risotto', 'Creamy arborio rice with porcini and truffle butter.', 18.50, 'Main Course', 'veg', true, 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=500&auto=format&fit=crop'),
    (v_rest_id, 'Grilled Salmon Steak', 'Atlantic salmon with roasted asparagus and lemon butter.', 24.99, 'Main Course', 'non-veg', true, 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=500&auto=format&fit=crop');

    -- Desserts
    INSERT INTO public.menu (restaurant_id, name, description, price, category, food_type, available, image_url)
    VALUES 
    (v_rest_id, 'Tiramisu', 'Classic Italian coffee-soaked dessert with mascarpone.', 9.50, 'Desserts', 'veg', true, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=500&auto=format&fit=crop'),
    (v_rest_id, 'Lava Cake', 'Warm chocolate cake with a molten center and vanilla bean ice cream.', 10.00, 'Desserts', 'veg', true, 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=500&auto=format&fit=crop');

    -- Beverages
    INSERT INTO public.menu (restaurant_id, name, description, price, category, food_type, available, image_url)
    VALUES 
    (v_rest_id, 'Sparkling Berry Lemonade', 'House-made lemonade with fresh berries and mint.', 5.50, 'Beverages', 'veg', true, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=500&auto=format&fit=crop'),
    (v_rest_id, 'Cold Brew Coffee', '12-hour steep, served over ice.', 4.50, 'Beverages', 'veg', true, 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=500&auto=format&fit=crop');

    -- 4. Seed Orders
    -- ============================================================================
    DELETE FROM public.orders WHERE restaurant_id = v_rest_id;

    -- Order 1: Pending
    INSERT INTO public.orders (order_id, restaurant_id, table_no, customer_name, total, tax, status, note, items)
    VALUES ('DEMO10', v_rest_id, 'T-04', 'Sarah Miller', 32.49, 2.76, 'pending', 'Extra napkins please.', 
    '[{"name": "Truffle Fries", "qty": 1, "price": 8.99}, {"name": "Grilled Salmon Steak", "qty": 1, "price": 24.99}]'::JSONB);

    -- Order 2: Preparing
    INSERT INTO public.orders (order_id, restaurant_id, table_no, customer_name, total, tax, status, note, items)
    VALUES ('DEMO11', v_rest_id, 'T-02', 'John Doe', 28.00, 2.38, 'preparing', '', 
    '[{"name": "Classic Margherita Pizza", "qty": 2, "price": 14.00}]'::JSONB);

    -- Order 3: Done
    INSERT INTO public.orders (order_id, restaurant_id, table_no, customer_name, total, tax, status, items)
    VALUES ('DEMO12', v_rest_id, 'T-08', 'Alex Reed', 15.50, 1.32, 'done', 
    '[{"name": "Lava Cake", "qty": 1, "price": 10.00}, {"name": "Sparkling Berry Lemonade", "qty": 1, "price": 5.50}]'::JSONB);

END $$;
