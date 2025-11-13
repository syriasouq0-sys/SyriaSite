import { supabaseHelpers } from './supabase';

interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  products: {
    id: string;
    title: {
      en: string;
      ar: string;
      sv: string;
    };
    images: string[];
  };
}

interface Order {
  id: string;
  total_amount: number;
  currency: string;
  status: string;
  shipping: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  discount_code: string | null;
  discount_amount: number;
  created_at: string;
  order_items?: OrderItem[];
}

// Format currency
const formatCurrency = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'SEK',
  }).format(amount);
};

/**
 * In a real app, this would send an actual email.
 * For this demo, we'll just simulate sending an email by logging it to the console
 * and updating the database.
 */
export const sendOrderConfirmationEmail = async (orderId: string): Promise<boolean> => {
  try {
    // Fetch the order with items
    const { data: order, error } = await supabaseHelpers.supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (id, title, images)
        )
      `)
      .eq('id', orderId)
      .single();

    if (error) {
      return false;
    }

    if (!order) {
      return false;
    }

    // Update the order with email_sent flag
    const { error: updateError } = await supabaseHelpers.supabase
      .from('orders')
      .update({ email_sent: true })
      .eq('id', orderId);

    if (updateError) {
      return false;
    }

    return true;
  } catch (err) {
    return false;
  }
};
