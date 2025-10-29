-- Verify RLS policies for products table
-- Run this AFTER running fix-products-rls.sql to confirm policies are set correctly

-- Check if RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'products';

-- List all policies on products table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'products'
ORDER BY policyname;

-- Test query as anonymous user (simulate what your app does)
-- This should return products if RLS is configured correctly
SELECT COUNT(*) as product_count FROM products;

-- Expected results:
-- 1. RLS should be enabled (rls_enabled = true)
-- 2. There should be a policy named "Anyone can read products" with cmd = 'SELECT'
-- 3. The COUNT query should return a number (not error or timeout)

