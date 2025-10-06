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
      console.error('Error fetching order for email:', error);
      return false;
    }

    if (!order) {
      console.error('Order not found for email');
      return false;
    }

    // Log email details to console (for demo purposes)
    console.log('--------------------------------');
    console.log('📧 MOCK EMAIL CONFIRMATION SENT');
    console.log('--------------------------------');
    console.log(`To: ${order.shipping.email}`);
    console.log(`Subject: Your Order Confirmation #${order.id}`);
    console.log(`Order Total: ${formatCurrency(order.total_amount, order.currency)}`);
    console.log(`Items: ${order.order_items?.length || 0}`);
    console.log('--------------------------------');

    // Update the order with email_sent flag
    const { error: updateError } = await supabaseHelpers.supabase
      .from('orders')
      .update({ email_sent: true })
      .eq('id', orderId);

    if (updateError) {
      console.error('Error updating order email status:', updateError);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error sending mock email:', err);
    return false;
  }
};
