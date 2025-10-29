-- Test the EXACT query your app uses for featured products
-- Run this to verify RLS allows the query

SELECT * 
FROM products 
WHERE featured = true 
ORDER BY created_at DESC 
LIMIT 4;

-- If this returns products (not empty, not timeout), then RLS is fixed!
-- Your browser might just need a hard refresh (Ctrl+Shift+R)

