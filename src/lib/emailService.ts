import emailjs from '@emailjs/browser';
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

// Initialize EmailJS
// You need to sign up at https://www.emailjs.com/ and get your own service ID, template ID, and user ID
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_default';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_default';
const EMAILJS_USER_ID = import.meta.env.VITE_EMAILJS_USER_ID || 'user_default';

// Initialize EmailJS
emailjs.init(EMAILJS_USER_ID);

/**
 * Send a real order confirmation email using EmailJS
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

    // Format order data for the email template
    const orderData = order as Order;
    const orderDate = new Date(orderData.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Create item list for email
    const itemsList = orderData.order_items
      ? orderData.order_items.map(item => 
          `${item.products.title.en} (${item.quantity}x) - ${formatCurrency(item.unit_price * item.quantity, orderData.currency)}`
        ).join('\n')
      : 'No items';

    // Prepare template parameters
    const templateParams = {
      to_email: orderData.shipping.email,
      to_name: orderData.shipping.fullName,
      order_id: orderData.id,
      order_date: orderDate,
      order_total: formatCurrency(orderData.total_amount, orderData.currency),
      items_list: itemsList,
      shipping_address: `${orderData.shipping.address}, ${orderData.shipping.postalCode}, ${orderData.shipping.city}, ${orderData.shipping.country}`,
      discount: orderData.discount_amount > 0 ? formatCurrency(orderData.discount_amount, orderData.currency) : 'No discount',
    };

    // Send the email using EmailJS
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    if (response.status === 200) {
      // Update the order with email_sent flag
      const { error: updateError } = await supabaseHelpers.supabase
        .from('orders')
        .update({ email_sent: true })
        .eq('id', orderId);

      if (updateError) {
        // Silent error handling
      }
      
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};
