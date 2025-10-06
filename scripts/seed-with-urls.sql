-- Seed script for Syrian Essence Shop
-- IMPORTANT: Replace 'YOUR_PROJECT_ID' with your actual Supabase project ID
-- Find your project ID in the Supabase dashboard URL or Settings -> API
-- Format: https://YOUR_PROJECT_ID.supabase.co

-- Clear existing data (optional - uncomment if you want a fresh start)
-- TRUNCATE products CASCADE;

INSERT INTO products (slug, title, description, price, currency, stock, category, tags, images, featured) VALUES
(
  'syrian-flag-large',
  '{"en": "Syrian Flag - Large", "ar": "العلم السوري - كبير", "sv": "Syrisk flagga - Stor"}',
  '{"en": "Beautiful large Syrian flag with golden fringe. Perfect for display at home or events. High-quality fabric with vibrant colors.", "ar": "علم سوري كبير جميل مع حافة ذهبية. مثالي للعرض في المنزل أو الفعاليات. قماش عالي الجودة بألوان زاهية.", "sv": "Vacker stor syrisk flagga med guldkant. Perfekt för visning hemma eller på evenemang. Högkvalitativt tyg med livfulla färger."}',
  299,
  'SEK',
  25,
  'flags',
  ARRAY['flag', 'large', 'fringe'],
  ARRAY['https://bpodcracdguhlldzwmjo.supabase.co/storage/v1/object/public/product-images/flag-main.jpg'],
  true
),
(
  'syrian-flag-desk',
  '{"en": "Syrian Flag - Desk Size", "ar": "العلم السوري - حجم المكتب", "sv": "Syrisk flagga - Skrivbordsstorlek"}',
  '{"en": "Compact desk flag with golden fringe. Perfect for your office or study. Premium satin finish.", "ar": "علم مكتب صغير مع حافة ذهبية. مثالي لمكتبك أو دراستك. تشطيب ساتان ممتاز.", "sv": "Kompakt skrivbordsflagga med guldkant. Perfekt för ditt kontor eller studierum. Premium satinfinish."}',
  149,
  'SEK',
  40,
  'flags',
  ARRAY['flag', 'desk', 'small'],
  ARRAY['https://bpodcracdguhlldzwmjo.supabase.co/storage/v1/object/public/product-images/flag-desk.jpg'],
  true
),
(
  'syria-scarf-official',
  '{"en": "Syria Scarf - Official Edition", "ar": "وشاح سوريا - نسخة رسمية", "sv": "Syria halsduk - Officiell utgåva"}',
  '{"en": "Premium official Syria scarf with SYRIA text. Soft satin material with fringes. Perfect for supporters and fans.", "ar": "وشاح سوريا الرسمي الممتاز مع نص SYRIA. مادة ساتان ناعمة مع شراشيب. مثالي للمؤيدين والمشجعين.", "sv": "Premium officiell Syrienhalsduk med SYRIA-text. Mjukt satinmaterial med fransar. Perfekt för supportrar och fans."}',
  199,
  'SEK',
  30,
  'scarves',
  ARRAY['scarf', 'official', 'supporter'],
  ARRAY['https://bpodcracdguhlldzwmjo.supabase.co/storage/v1/object/public/product-images/scarf-official.jpg'],
  true
),
(
  'syria-scarf-mini',
  '{"en": "Syria Mini Scarf", "ar": "وشاح سوريا المصغر", "sv": "Syria mini halsduk"}',
  '{"en": "Compact mini scarf featuring the Syrian flag. Lightweight and perfect for everyday wear or decoration.", "ar": "وشاح مصغر يحمل العلم السوري. خفيف الوزن ومثالي للارتداء اليومي أو الزينة.", "sv": "Kompakt minihalsduk med den syriska flaggan. Lättviktig och perfekt för vardagligt bruk eller dekoration."}',
  129,
  'SEK',
  50,
  'scarves',
  ARRAY['scarf', 'mini', 'compact'],
  ARRAY['https://bpodcracdguhlldzwmjo.supabase.co/storage/v1/object/public/product-images/scarf-mini.jpg'],
  false
),
(
  'syria-scarf-crochet',
  '{"en": "Handmade Crochet Syria Scarf", "ar": "وشاح سوريا كروشيه مصنوع يدوياً", "sv": "Handgjord virkat Syrienhalsduk"}',
  '{"en": "Unique handmade crochet scarf in Syrian flag colors. Each piece is crafted with care. Soft and warm.", "ar": "وشاح كروشيه مصنوع يدوياً فريد من نوعه بألوان العلم السوري. كل قطعة مصنوعة بعناية. ناعم ودافئ.", "sv": "Unik handgjord virkat halsduk i syriska flaggfärger. Varje stycke är noggrant tillverkat. Mjuk och varm."}',
  249,
  'SEK',
  15,
  'scarves',
  ARRAY['scarf', 'handmade', 'crochet'],
  ARRAY['https://bpodcracdguhlldzwmjo.supabase.co/storage/v1/object/public/product-images/scarf-crochet.jpg'],
  true
),
(
  'syria-bracelet',
  '{"en": "Syria Flag Bracelet", "ar": "سوار علم سوريا", "sv": "Syriskt flaggarmband"}',
  '{"en": "Stylish silicon bracelet featuring Syrian flag colors. Comfortable and durable. Show your pride wherever you go.", "ar": "سوار سيليكون أنيق يحمل ألوان العلم السوري. مريح ومتين. أظهر فخرك أينما ذهبت.", "sv": "Stilfullt silikonarmband med syriska flaggfärger. Bekvämt och hållbart. Visa din stolthet vart du än går."}',
  79,
  'SEK',
  100,
  'accessories',
  ARRAY['bracelet', 'silicon', 'accessory'],
  ARRAY['https://bpodcracdguhlldzwmjo.supabase.co/storage/v1/object/public/product-images/bracelet.jpg'],
  false
),
(
  'syria-woven-bag',
  '{"en": "Syria Woven Tote Bag", "ar": "حقيبة سوريا المنسوجة", "sv": "Syrisk vävd totebag"}',
  '{"en": "Beautiful handwoven tote bag with Syrian flag colors and zipper detail. Spacious and practical for daily use.", "ar": "حقيبة منسوجة يدوياً جميلة بألوان العلم السوري وتفصيل سحاب. فسيحة وعملية للاستخدام اليومي.", "sv": "Vacker handvävd totebag med syriska flaggfärger och blixtlåsdetalj. Rymlig och praktisk för dagligt bruk."}',
  349,
  'SEK',
  20,
  'accessories',
  ARRAY['bag', 'woven', 'handmade'],
  ARRAY['https://bpodcracdguhlldzwmjo.supabase.co/storage/v1/object/public/product-images/bag.jpg'],
  false
);

-- Verify the data was inserted
SELECT 
  slug, 
  title->>'en' as title_en,
  price,
  stock,
  category,
  featured,
  created_at
FROM products
ORDER BY created_at DESC;

