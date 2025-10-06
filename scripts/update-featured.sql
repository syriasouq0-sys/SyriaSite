-- Update existing products to mark them as featured
-- This will ensure 4 products are featured without causing duplicate key errors

UPDATE products 
SET featured = true 
WHERE slug IN (
  'syrian-flag-large',
  'syrian-flag-desk',
  'syria-scarf-official',
  'syria-scarf-crochet'
);

-- Verify which products are now featured
SELECT 
  slug, 
  title->>'en' as title_en,
  price,
  stock,
  category,
  featured,
  created_at
FROM products
WHERE featured = true
ORDER BY created_at DESC;

