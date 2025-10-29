-- ============================================================================
-- FIX PRODUCTS RLS POLICIES - Single Script to Solve All Issues
-- ============================================================================
-- This script fixes Row Level Security (RLS) policies so that anonymous users
-- can read products from the products table.
--
-- Run this script in Supabase SQL Editor once, and your products will load!
-- ============================================================================

-- Step 1: Drop ALL existing policies on products table to start fresh
DROP POLICY IF EXISTS "Enable all operations for products" ON products;
DROP POLICY IF EXISTS "Enable delete for products" ON products;
DROP POLICY IF EXISTS "Enable insert for products" ON products;
DROP POLICY IF EXISTS "Enable update for products" ON products;
DROP POLICY IF EXISTS "Public can read products" ON products;
DROP POLICY IF EXISTS "Authenticated users can read products" ON products;
DROP POLICY IF EXISTS "Anyone can read products" ON products;
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
DROP POLICY IF EXISTS "only_admins_can_insert_products" ON products;
DROP POLICY IF EXISTS "only_admins_can_update_products" ON products;
DROP POLICY IF EXISTS "only_admins_can_delete_products" ON products;
DROP POLICY IF EXISTS "Only admins can insert products" ON products;
DROP POLICY IF EXISTS "Only admins can update products" ON products;
DROP POLICY IF EXISTS "Only admins can delete products" ON products;
DROP POLICY IF EXISTS "Allow admin to update discount" ON products;
DROP POLICY IF EXISTS "Block all inserts" ON products;
DROP POLICY IF EXISTS "Block all updates" ON products;
DROP POLICY IF EXISTS "Block all deletes" ON products;

-- Step 2: Ensure RLS is enabled (required for policies to work)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Step 3: Create the critical policy - Allow EVERYONE (anonymous + authenticated) to READ products
-- This is the policy that fixes your timeout issue!
CREATE POLICY "Anyone can read products" 
  ON products 
  FOR SELECT 
  USING (true);

-- Step 4: Create admin-only write policies (optional - only if admin_users table exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'admin_users') THEN
    -- Admin can INSERT
    CREATE POLICY "Only admins can insert products" 
      ON products 
      FOR INSERT 
      WITH CHECK (
        EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
      );

    -- Admin can UPDATE
    CREATE POLICY "Only admins can update products" 
      ON products 
      FOR UPDATE 
      USING (
        EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
      );

    -- Admin can DELETE
    CREATE POLICY "Only admins can delete products" 
      ON products 
      FOR DELETE 
      USING (
        EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
      );
  ELSE
    -- If no admin_users table, block all writes
    CREATE POLICY "Block all inserts" ON products FOR INSERT WITH CHECK (false);
    CREATE POLICY "Block all updates" ON products FOR UPDATE USING (false);
    CREATE POLICY "Block all deletes" ON products FOR DELETE USING (false);
  END IF;
END $$;

-- Step 5: Verify the policy was created successfully
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'products' 
    AND policyname = 'Anyone can read products'
    AND cmd = 'SELECT'
  ) THEN
    RAISE NOTICE '✅ SUCCESS! Policy "Anyone can read products" created successfully!';
    RAISE NOTICE '✅ Your products should now be accessible to anonymous users.';
    RAISE NOTICE '✅ Refresh your browser and products should load!';
  ELSE
    RAISE EXCEPTION '❌ FAILED! Policy was not created. Please check for errors above.';
  END IF;
END $$;

-- Step 6: Display current policies for verification
SELECT 
  policyname as "Policy Name",
  cmd as "Operation",
  roles as "Roles",
  CASE 
    WHEN cmd = 'SELECT' THEN '✅ This allows reading products'
    WHEN cmd = 'INSERT' THEN '🔒 This controls creating products'
    WHEN cmd = 'UPDATE' THEN '🔒 This controls updating products'
    WHEN cmd = 'DELETE' THEN '🔒 This controls deleting products'
  END as "Status"
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'products'
ORDER BY cmd, policyname;

-- Done! If you see "Anyone can read products" with Operation = SELECT above,
-- then the fix is complete. Refresh your browser!

