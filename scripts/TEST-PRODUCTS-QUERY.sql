-- Quick verification: Check if SELECT policy allows anonymous access
SELECT 
  policyname,
  cmd,
  qual as using_clause,
  roles,
  CASE 
    WHEN cmd = 'SELECT' AND (qual = '(true)' OR qual = 'true' OR qual IS NULL) THEN '✅ OK'
    WHEN cmd = 'SELECT' THEN '❌ PROBLEM - USING clause: ' || qual
    ELSE 'OK'
  END as status
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'products'
AND cmd = 'SELECT';

-- Test the exact query your app uses
SELECT * FROM products WHERE featured = true ORDER BY created_at DESC LIMIT 4;

-- If this query works AND returns results, your app should work too!

