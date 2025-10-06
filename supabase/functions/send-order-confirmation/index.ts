import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { corsHeaders } from '../_shared/cors.ts';

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

// Generate email HTML
const generateEmailHTML = (order: Order): string => {
  const orderDate = new Date(order.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Generate order items HTML
  const orderItemsHTML = order.order_items
    ? order.order_items
        .map(
          (item) => `
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">
              <div style="display: flex; align-items: center;">
                <img src="${
                  item.products.images[0]
                }" alt="${
            item.products.title.en
          }" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; margin-right: 12px;">
                <div>
                  <p style="margin: 0; font-weight: 500;">${
                    item.products.title.en
                  }</p>
                  <p style="margin: 0; font-size: 12px; color: #64748b;">Qty: ${
                    item.quantity
                  }</p>
                </div>
              </div>
            </td>
            <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right;">
              ${formatCurrency(item.unit_price * item.quantity, order.currency)}
            </td>
          </tr>
        `
        )
        .join('')
    : '';

  // Calculate subtotal
  const subtotal = order.order_items
    ? order.order_items.reduce(
        (sum, item) => sum + item.unit_price * item.quantity,
        0
      )
    : 0;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
        <!-- Header -->
        <div style="background-color: #8b5cf6; padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Order Confirmation</h1>
        </div>
        
        <!-- Content -->
        <div style="padding: 24px;">
          <p style="margin-top: 0;">Dear ${order.shipping.fullName},</p>
          <p>Thank you for your order! We're pleased to confirm that we've received your order and it's being processed.</p>
          
          <div style="background-color: #f1f5f9; border-radius: 6px; padding: 16px; margin: 24px 0;">
            <p style="margin-top: 0; font-weight: 600; font-size: 14px; color: #64748b;">ORDER SUMMARY</p>
            <p style="margin-bottom: 0; font-size: 14px;"><strong>Order Number:</strong> ${order.id}</p>
            <p style="margin-bottom: 0; font-size: 14px;"><strong>Order Date:</strong> ${orderDate}</p>
          </div>
          
          <!-- Order Items -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <thead>
              <tr>
                <th style="text-align: left; padding: 12px; border-bottom: 2px solid #e2e8f0;">Item</th>
                <th style="text-align: right; padding: 12px; border-bottom: 2px solid #e2e8f0;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${orderItemsHTML}
            </tbody>
            <tfoot>
              <tr>
                <td style="padding: 12px; text-align: right; font-weight: 600;">Subtotal:</td>
                <td style="padding: 12px; text-align: right;">${formatCurrency(
                  subtotal,
                  order.currency
                )}</td>
              </tr>
              ${
                order.discount_amount > 0
                  ? `
                <tr>
                  <td style="padding: 12px; text-align: right; font-weight: 600;">Discount:</td>
                  <td style="padding: 12px; text-align: right; color: #ef4444;">-${formatCurrency(
                    order.discount_amount,
                    order.currency
                  )}</td>
                </tr>
              `
                  : ''
              }
              <tr>
                <td style="padding: 12px; text-align: right; font-weight: 600; font-size: 18px;">Total:</td>
                <td style="padding: 12px; text-align: right; font-weight: 600; font-size: 18px; color: #8b5cf6;">
                  ${formatCurrency(order.total_amount, order.currency)}
                </td>
              </tr>
            </tfoot>
          </table>
          
          <!-- Shipping Information -->
          <div style="background-color: #f1f5f9; border-radius: 6px; padding: 16px; margin: 24px 0;">
            <p style="margin-top: 0; font-weight: 600; font-size: 14px; color: #64748b;">SHIPPING INFORMATION</p>
            <p style="margin-bottom: 4px;">${order.shipping.fullName}</p>
            <p style="margin-bottom: 4px;">${order.shipping.address}</p>
            <p style="margin-bottom: 4px;">${order.shipping.postalCode}, ${order.shipping.city}</p>
            <p style="margin-bottom: 0;">${order.shipping.country}</p>
          </div>
          
          <p>Your order will be shipped within 2-3 business days. We'll send you another email with tracking information once your order has been shipped.</p>
          
          <p>If you have any questions about your order, please contact our customer service at <a href="mailto:info@syriastore.com" style="color: #8b5cf6;">info@syriastore.com</a>.</p>
          
          <p style="margin-bottom: 0;">Thank you for shopping with us!</p>
          <p style="font-weight: 600; margin-top: 8px;">Syria Store Team</p>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #64748b;">
          <p style="margin: 0;">© ${new Date().getFullYear()} Syria Store. All rights reserved.</p>
          <p style="margin: 8px 0 0 0;">This is an automated email, please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the request body
    const { orderId } = await req.json();

    if (!orderId) {
      return new Response(
        JSON.stringify({ error: 'Order ID is required' }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          } 
        }
      );
    }

    // Fetch the order with items
    const { data: order, error } = await supabaseClient
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
      console.error('Error fetching order:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch order details' }),
        { 
          status: 500, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          } 
        }
      );
    }

    if (!order) {
      return new Response(
        JSON.stringify({ error: 'Order not found' }),
        { 
          status: 404, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          } 
        }
      );
    }

    // Generate email content
    const emailHTML = generateEmailHTML(order as Order);
    
    // For development, we'll just log the email content and update the flag
    // In production, you would connect to an SMTP service here
    console.log('Email would be sent to:', order.shipping.email);
    console.log('Email HTML:', emailHTML.substring(0, 200) + '...');
    
    // Update the order with email_sent flag
    await supabaseClient
      .from('orders')
      .update({ email_sent: true })
      .eq('id', orderId);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Order confirmation email sent',
        recipient: order.shipping.email
      }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  } catch (err) {
    console.error('Unexpected error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: err.message }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }
});