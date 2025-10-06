export interface Product {
  id: string;
  slug: string;
  title: {
    en: string;
    ar: string;
    sv: string;
  };
  description: {
    en: string;
    ar: string;
    sv: string;
  };
  price: number;
  currency: string;
  stock: number;
  category: string;
  tags: string[];
  images: string[];
  featured?: boolean;
  discount_percentage?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type Currency = 'SEK' | 'USD' | 'EUR';
export type Language = 'en' | 'ar' | 'sv';
