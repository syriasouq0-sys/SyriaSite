-- Test the EXACT query your app uses (featured products)
-- This should return results if RLS is working correctly

SELECT * 
FROM products 
WHERE featured = true 
ORDER BY created_at DESC 
LIMIT 4;

-- If this query works and returns products, then:
-- ✅ RLS policies are correct
-- ✅ The issue might be browser caching or React Query cache
-- 
-- Solution: Hard refresh browser (Ctrl+Shift+R) or clear browser cache

