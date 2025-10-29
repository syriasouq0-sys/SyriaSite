-- Fix RLS policies for products table to allow both anonymous and authenticated users to read
-- This ensures products are visible to everyone (shop customers) whether logged in or not

-- First, verify the table exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'products') THEN
    RAISE EXCEPTION 'Table "products" does not exist in public schema. Please check your table name.';
  END IF;
END $$;

-- Drop existing policies if they exist (drop ALL possible policy names)
DROP POLICY IF EXISTS "Enable all operations for products" ON products;
DROP POLICY IF EXISTS "Public can read products" ON products;
DROP POLICY IF EXISTS "Authenticated users can read products" ON products;
DROP POLICY IF EXISTS "Anyone can read products" ON products;
DROP POLICY IF EXISTS "only_admins_can_insert_products" ON products;
DROP POLICY IF EXISTS "only_admins_can_update_products" ON products;
DROP POLICY IF EXISTS "only_admins_can_delete_products" ON products;
DROP POLICY IF EXISTS "Only admins can insert products" ON products;
DROP POLICY IF EXISTS "Only admins can update products" ON products;
DROP POLICY IF EXISTS "Only admins can delete products" ON products;

-- IMPORTANT: Allow EVERYONE (anonymous and authenticated) to read products
-- This MUST exist for products to be accessible
-- Explicitly allow both public (anonymous) and authenticated users
CREATE POLICY "Anyone can read products" 
  ON products 
  FOR SELECT 
  TO public, authenticated
  USING (true);

-- Verify the policy was created
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'products' 
    AND policyname = 'Anyone can read products'
  ) THEN
    RAISE EXCEPTION 'Failed to create read policy!';
  ELSE
    RAISE NOTICE '✅ Successfully created "Anyone can read products" policy';
  END IF;
END $$;

-- Only admins can modify products
-- Check if admin_users table exists before creating admin-only policies
DO $$
BEGIN
  -- Only create admin policies if admin_users table exists
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'admin_users') THEN
    -- Create policy for INSERT - only admins
    DROP POLICY IF EXISTS "Only admins can insert products" ON products;
    CREATE POLICY "Only admins can insert products" 
      ON products 
      FOR INSERT 
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM admin_users 
          WHERE id = auth.uid()
        )
      );

    -- Create policy for UPDATE - only admins
    DROP POLICY IF EXISTS "Only admins can update products" ON products;
    CREATE POLICY "Only admins can update products" 
      ON products 
      FOR UPDATE 
      USING (
        EXISTS (
          SELECT 1 FROM admin_users 
          WHERE id = auth.uid()
        )
      );

    -- Create policy for DELETE - only admins
    DROP POLICY IF EXISTS "Only admins can delete products" ON products;
    CREATE POLICY "Only admins can delete products" 
      ON products 
      FOR DELETE 
      USING (
        EXISTS (
          SELECT 1 FROM admin_users 
          WHERE id = auth.uid()
        )
      );
  ELSE
    -- If admin_users table doesn't exist, block all writes for now
    -- You can modify these later to allow authenticated users or specific roles
    RAISE NOTICE 'admin_users table not found. Write operations will be blocked.';
    
    DROP POLICY IF EXISTS "Only admins can insert products" ON products;
    CREATE POLICY "Only admins can insert products" 
      ON products 
      FOR INSERT 
      WITH CHECK (false); -- Block all inserts
    
    DROP POLICY IF EXISTS "Only admins can update products" ON products;
    CREATE POLICY "Only admins can update products" 
      ON products 
      FOR UPDATE 
      USING (false); -- Block all updates
    
    DROP POLICY IF EXISTS "Only admins can delete products" ON products;
    CREATE POLICY "Only admins can delete products" 
      ON products 
      FOR DELETE 
      USING (false); -- Block all deletes
  END IF;
END $$;

-- Ensure RLS is enabled
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

