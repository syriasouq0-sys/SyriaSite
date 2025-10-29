-- DIAGNOSTIC: Check current RLS setup for products table
-- Run this BEFORE running fix-products-rls.sql to see what's currently configured

-- 1. Check if table exists and RLS status
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled,
  CASE WHEN rowsecurity THEN '🔒 RLS Enabled' ELSE '⚠️ RLS Disabled' END as status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'products';

-- 2. List ALL policies on products table (this is the key check!)
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd as operation_type,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'products'
ORDER BY policyname;

-- 3. Check if there are any restrictive policies that might block SELECT
SELECT 
  policyname,
  cmd,
  qual,
  'This policy might be blocking SELECT' as warning
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'products'
AND cmd = 'SELECT'
AND (qual IS NULL OR qual != 'true' OR qual != '(true)');

-- 4. Count products (should work if RLS is configured correctly)
SELECT COUNT(*) as total_products FROM products;

-- Expected Results:
-- ✅ If RLS is working: You should see a policy with cmd='SELECT' and qual='(true)' or similar
-- ❌ If RLS is blocking: Either no SELECT policy exists, or policy has restrictive conditions
-- 🔍 If table doesn't exist: Check if it's in a different schema or has a different name

