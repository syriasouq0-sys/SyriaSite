-- ============================================================================
-- VERIFY RLS POLICIES - Run this to confirm everything is set correctly
-- ============================================================================

-- Check 1: Verify the SELECT policy exists and is correct
SELECT 
  policyname as "Policy Name",
  cmd as "Operation",
  qual as "USING Clause",
  roles as "Roles",
  CASE 
    WHEN cmd = 'SELECT' AND (qual = '(true)' OR qual = 'true') THEN '✅ CORRECT - This will work!'
    WHEN cmd = 'SELECT' THEN '⚠️ WARNING - Check USING clause: ' || qual
    ELSE '🔒 Write operation'
  END as "Status"
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'products'
ORDER BY cmd, policyname;

-- Check 2: Verify RLS is enabled
SELECT 
  tablename,
  rowsecurity as "RLS Enabled",
  CASE 
    WHEN rowsecurity THEN '✅ RLS is ON'
    ELSE '❌ RLS is OFF - This is a problem!'
  END as "Status"
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'products';

-- Check 3: Test query (should work if policy is correct)
SELECT COUNT(*) as product_count FROM products;

-- Expected Results:
-- ✅ SELECT policy should show: "Anyone can read products" with USING Clause = "(true)" or "true"
-- ✅ RLS Enabled should be: true
-- ✅ product_count should show: 7
--
-- If all three checks pass, refresh your browser and products should load!

