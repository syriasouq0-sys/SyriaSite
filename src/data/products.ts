import { Product } from '@/types/product';
import flagMain from '@/assets/flag-main.jpg';
import flagDesk from '@/assets/flag-desk.jpg';
import scarfOfficial from '@/assets/scarf-official.jpg';
import scarfMini from '@/assets/scarf-mini.jpg';
import scarfCrochet from '@/assets/scarf-crochet.jpg';
import bracelet from '@/assets/bracelet.jpg';
import bag from '@/assets/bag.jpg';

export const products: Product[] = [
  {
    id: '1',
    slug: 'syrian-flag-large',
    title: {
      en: 'Syrian Flag - Large',
      ar: 'العلم السوري - كبير',
      sv: 'Syrisk flagga - Stor',
    },
    description: {
      en: 'Beautiful large Syrian flag with golden fringe. Perfect for display at home or events. High-quality fabric with vibrant colors.',
      ar: 'علم سوري كبير جميل مع حافة ذهبية. مثالي للعرض في المنزل أو الفعاليات. قماش عالي الجودة بألوان زاهية.',
      sv: 'Vacker stor syrisk flagga med guldkant. Perfekt för visning hemma eller på evenemang. Högkvalitativt tyg med livfulla färger.',
    },
    price: 299,
    currency: 'SEK',
    stock: 25,
    category: 'flags',
    tags: ['flag', 'large', 'fringe'],
    images: [flagMain],
    featured: true,
  },
  {
    id: '2',
    slug: 'syrian-flag-desk',
    title: {
      en: 'Syrian Flag - Desk Size',
      ar: 'العلم السوري - حجم المكتب',
      sv: 'Syrisk flagga - Skrivbordsstorlek',
    },
    description: {
      en: 'Compact desk flag with golden fringe. Perfect for your office or study. Premium satin finish.',
      ar: 'علم مكتب صغير مع حافة ذهبية. مثالي لمكتبك أو دراستك. تشطيب ساتان ممتاز.',
      sv: 'Kompakt skrivbordsflagga med guldkant. Perfekt för ditt kontor eller studierum. Premium satinfinish.',
    },
    price: 149,
    currency: 'SEK',
    stock: 40,
    category: 'flags',
    tags: ['flag', 'desk', 'small'],
    images: [flagDesk],
    featured: true,
  },
  {
    id: '3',
    slug: 'syria-scarf-official',
    title: {
      en: 'Syria Scarf - Official Edition',
      ar: 'وشاح سوريا - نسخة رسمية',
      sv: 'Syria halsduk - Officiell utgåva',
    },
    description: {
      en: 'Premium official Syria scarf with "SYRIA" text. Soft satin material with fringes. Perfect for supporters and fans.',
      ar: 'وشاح سوريا الرسمي الممتاز مع نص "SYRIA". مادة ساتان ناعمة مع شراشيب. مثالي للمؤيدين والمشجعين.',
      sv: 'Premium officiell Syrienhalsduk med "SYRIA"-text. Mjukt satinmaterial med fransar. Perfekt för supportrar och fans.',
    },
    price: 199,
    currency: 'SEK',
    stock: 30,
    category: 'scarves',
    tags: ['scarf', 'official', 'supporter'],
    images: [scarfOfficial],
    featured: true,
  },
  {
    id: '4',
    slug: 'syria-scarf-mini',
    title: {
      en: 'Syria Mini Scarf',
      ar: 'وشاح سوريا المصغر',
      sv: 'Syria mini halsduk',
    },
    description: {
      en: 'Compact mini scarf featuring the Syrian flag. Lightweight and perfect for everyday wear or decoration.',
      ar: 'وشاح مصغر يحمل العلم السوري. خفيف الوزن ومثالي للارتداء اليومي أو الزينة.',
      sv: 'Kompakt minihalsduk med den syriska flaggan. Lättviktig och perfekt för vardagligt bruk eller dekoration.',
    },
    price: 129,
    currency: 'SEK',
    stock: 50,
    category: 'scarves',
    tags: ['scarf', 'mini', 'compact'],
    images: [scarfMini],
  },
  {
    id: '5',
    slug: 'syria-scarf-crochet',
    title: {
      en: 'Handmade Crochet Syria Scarf',
      ar: 'وشاح سوريا كروشيه مصنوع يدوياً',
      sv: 'Handgjord virkat Syrienhalsduk',
    },
    description: {
      en: 'Unique handmade crochet scarf in Syrian flag colors. Each piece is crafted with care. Soft and warm.',
      ar: 'وشاح كروشيه مصنوع يدوياً فريد من نوعه بألوان العلم السوري. كل قطعة مصنوعة بعناية. ناعم ودافئ.',
      sv: 'Unik handgjord virkat halsduk i syriska flaggfärger. Varje stycke är noggrant tillverkat. Mjuk och varm.',
    },
    price: 249,
    currency: 'SEK',
    stock: 15,
    category: 'scarves',
    tags: ['scarf', 'handmade', 'crochet'],
    images: [scarfCrochet],
    featured: true,
  },
  {
    id: '6',
    slug: 'syria-bracelet',
    title: {
      en: 'Syria Flag Bracelet',
      ar: 'سوار علم سوريا',
      sv: 'Syriskt flaggarmband',
    },
    description: {
      en: 'Stylish silicon bracelet featuring Syrian flag colors. Comfortable and durable. Show your pride wherever you go.',
      ar: 'سوار سيليكون أنيق يحمل ألوان العلم السوري. مريح ومتين. أظهر فخرك أينما ذهبت.',
      sv: 'Stilfullt silikonarmband med syriska flaggfärger. Bekvämt och hållbart. Visa din stolthet vart du än går.',
    },
    price: 79,
    currency: 'SEK',
    stock: 100,
    category: 'accessories',
    tags: ['bracelet', 'silicon', 'accessory'],
    images: [bracelet],
  },
  {
    id: '7',
    slug: 'syria-woven-bag',
    title: {
      en: 'Syria Woven Tote Bag',
      ar: 'حقيبة سوريا المنسوجة',
      sv: 'Syrisk vävd totebag',
    },
    description: {
      en: 'Beautiful handwoven tote bag with Syrian flag colors and zipper detail. Spacious and practical for daily use.',
      ar: 'حقيبة منسوجة يدوياً جميلة بألوان العلم السوري وتفصيل سحاب. فسيحة وعملية للاستخدام اليومي.',
      sv: 'Vacker handvävd totebag med syriska flaggfärger och blixtlåsdetalj. Rymlig och praktisk för dagligt bruk.',
    },
    price: 349,
    currency: 'SEK',
    stock: 20,
    category: 'accessories',
    tags: ['bag', 'woven', 'handmade'],
    images: [bag],
  },
];

export const getFeaturedProducts = () => products.filter((p) => p.featured);
export const getProductBySlug = (slug: string) => products.find((p) => p.slug === slug);
export const getProductsByCategory = (category: string) => products.filter((p) => p.category === category);
