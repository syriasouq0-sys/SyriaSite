-- ============================================================================
-- FIX PRODUCTS RLS POLICIES - FINAL CLEANUP VERSION
-- ============================================================================
-- This script removes ALL conflicting policies and creates ONE clean policy
-- that definitely works for anonymous users to read products.
-- ============================================================================

-- Step 1: Drop ALL existing policies (clean slate)
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

-- Step 2: Ensure RLS is enabled
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Step 3: Create ONE simple policy that allows everyone to read
-- This is the most permissive and simple policy - it MUST work
CREATE POLICY "Anyone can read products" 
  ON products 
  FOR SELECT 
  USING (true);

-- Step 4: Create admin-only write policies (only if admin_users exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'admin_users') THEN
    CREATE POLICY "Only admins can insert products" 
      ON products 
      FOR INSERT 
      WITH CHECK (
        EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
      );

    CREATE POLICY "Only admins can update products" 
      ON products 
      FOR UPDATE 
      USING (
        EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
      );

    CREATE POLICY "Only admins can delete products" 
      ON products 
      FOR DELETE 
      USING (
        EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
      );
  END IF;
END $$;

-- Step 5: Verify the SELECT policy exists and is correct
SELECT 
  policyname as "Policy Name",
  cmd as "Operation",
  qual as "USING Clause",
  CASE 
    WHEN cmd = 'SELECT' AND qual = '(true)' THEN '✅ CORRECT - This will work!'
    WHEN cmd = 'SELECT' THEN '⚠️ WARNING - Check USING clause'
    ELSE '🔒 Write operation'
  END as "Status"
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'products'
AND cmd = 'SELECT';

-- Step 6: Test query (should work now)
SELECT COUNT(*) as product_count FROM products;

-- Expected Result:
-- ✅ You should see "Anyone can read products" with USING Clause = "(true)"
-- ✅ The COUNT query should return a number (not timeout)
-- ✅ Refresh your browser - products should load!

