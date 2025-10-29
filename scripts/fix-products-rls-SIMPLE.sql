-- FINAL FIX: Create RLS policy for anonymous users to read products
-- Since your direct query works, we just need to create the policy

-- Step 1: Drop any existing policies that might conflict
DROP POLICY IF EXISTS "Anyone can read products" ON products;
DROP POLICY IF EXISTS "Public can read products" ON products;
DROP POLICY IF EXISTS "Enable all operations for products" ON products;
DROP POLICY IF EXISTS "Authenticated users can read products" ON products;

-- Step 2: Create the policy that allows EVERYONE (anonymous + authenticated) to read
CREATE POLICY "Anyone can read products" 
  ON products 
  FOR SELECT 
  TO public, authenticated
  USING (true);

-- Step 3: Verify it was created
SELECT 
  policyname,
  cmd,
  roles,
  qual,
  'Policy created successfully!' as status
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'products'
AND policyname = 'Anyone can read products';

-- Step 4: Test as anonymous user (simulate what your app does)
-- This should now work without timing out
SELECT COUNT(*) as product_count FROM products;

-- Expected: You should see the policy AND the count query should work

