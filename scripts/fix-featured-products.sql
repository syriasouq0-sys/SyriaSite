-- Add featured column to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured) WHERE featured = true;

-- Reset all products to not featured first
UPDATE products SET featured = false;

-- Set the first 4 products (by creation date) as featured
UPDATE products 
SET featured = true 
WHERE id IN (
  SELECT id FROM products 
  ORDER BY created_at DESC 
  LIMIT 4
);

-- Verify the featured products (should return 4 rows)
SELECT 
  slug, 
  title->>'en' as title_en,
  price,
  featured,
  created_at
FROM products
WHERE featured = true
ORDER BY created_at DESC;

