-- ============================================================================
-- FIX RLS POLICIES FOR AUTHENTICATED USERS - EXPLICIT VERSION
-- ============================================================================
-- This script fixes the issue where products are not accessible when users
-- are signed in. The solution is to create EXPLICIT policies for BOTH
-- anonymous (public) AND authenticated users.
-- ============================================================================

-- Step 1: Drop ALL existing policies on products table
DROP POLICY IF EXISTS "Enable all operations for products" ON products;
DROP POLICY IF EXISTS "Enable delete for products" ON products;
DROP POLICY IF EXISTS "Enable insert for products" ON products;
DROP POLICY IF EXISTS "Enable update for products" ON products;
DROP POLICY IF EXISTS "Public can read products" ON products;
DROP POLICY IF EXISTS "Authenticated users can read products" ON products;
DROP POLICY IF EXISTS "Anyone can read products" ON products;
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
DROP POLICY IF EXISTS "Anonymous can read products" ON products;
DROP POLICY IF EXISTS "Authenticated can read products" ON products;
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

-- Step 2: Ensure RLS is enabled
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Step 3: Create EXPLICIT policies for BOTH anonymous AND authenticated users
-- This is the critical fix - create separate policies for each role
-- Anonymous users (public role)
CREATE POLICY "Anonymous can read products" 
  ON products 
  FOR SELECT 
  TO public
  USING (true);

-- Authenticated users (authenticated role)
CREATE POLICY "Authenticated can read products" 
  ON products 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Step 4: Verify the policies were created
DO $$
BEGIN
  -- Check anonymous policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'products' 
    AND policyname = 'Anonymous can read products'
    AND cmd = 'SELECT'
  ) THEN
    RAISE EXCEPTION 'Failed to create anonymous read policy!';
  ELSE
    RAISE NOTICE '✅ Successfully created "Anonymous can read products" policy';
  END IF;
  
  -- Check authenticated policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'products' 
    AND policyname = 'Authenticated can read products'
    AND cmd = 'SELECT'
  ) THEN
    RAISE EXCEPTION 'Failed to create authenticated read policy!';
  ELSE
    RAISE NOTICE '✅ Successfully created "Authenticated can read products" policy';
  END IF;
  
  RAISE NOTICE '✅ Both anonymous AND authenticated users can now read products';
END $$;

-- Step 5: Create admin-only write policies (only if admin_users exists)
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
    
    RAISE NOTICE '✅ Created admin-only write policies';
  ELSE
    -- If no admin_users table, block all writes
    CREATE POLICY "Block all inserts" ON products FOR INSERT WITH CHECK (false);
    CREATE POLICY "Block all updates" ON products FOR UPDATE USING (false);
    CREATE POLICY "Block all deletes" ON products FOR DELETE USING (false);
    
    RAISE NOTICE '⚠️ No admin_users table found - blocking all writes';
  END IF;
END $$;

-- Step 6: Display current policies for verification
SELECT 
  policyname as "Policy Name",
  cmd as "Operation",
  roles as "Roles",
  qual as "USING Clause",
  CASE 
    WHEN cmd = 'SELECT' AND 'public' = ANY(roles) THEN '✅ Allows anonymous users'
    WHEN cmd = 'SELECT' AND 'authenticated' = ANY(roles) THEN '✅ Allows authenticated users'
    WHEN cmd = 'SELECT' AND qual = '(true)' THEN '✅ Should allow all users'
    WHEN cmd = 'SELECT' THEN '⚠️ Check USING clause'
    WHEN cmd = 'INSERT' THEN '🔒 Admin only'
    WHEN cmd = 'UPDATE' THEN '🔒 Admin only'
    WHEN cmd = 'DELETE' THEN '🔒 Admin only'
  END as "Status"
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'products'
ORDER BY cmd, policyname;

-- Step 7: Test query (should work for both anonymous and authenticated users)
SELECT COUNT(*) as product_count FROM products;

-- Expected Results:
-- ✅ You should see TWO SELECT policies:
--    1. "Anonymous can read products" with Roles = '{public}'
--    2. "Authenticated can read products" with Roles = '{authenticated}'
-- ✅ The COUNT query should return a number (not timeout)
-- ✅ Both anonymous and authenticated users should now be able to read products
-- ✅ Refresh your browser while signed in - products should load!
