import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Package, Home, Mail, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { supabaseHelpers } from '@/lib/supabase';
import { formatCurrency } from '@/lib/utils';

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

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(!!orderId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Celebrate with confetti!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Fetch order details if we have an order ID
    if (orderId) {
      const fetchOrder = async () => {
        try {
          const { data, error } = await supabaseHelpers.supabase
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
          
          if (error) throw error;
          setOrder(data as Order);
        } catch (err) {
          console.error('Error fetching order:', err);
          setError('Could not load order details');
        } finally {
          setLoading(false);
        }
      };
      
      fetchOrder();
    }
  }, [orderId]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-primary/5 to-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="border-2 border-primary/20">
          <CardContent className="pt-12 pb-8 text-center">
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-6 h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center"
            >
              <CheckCircle className="h-16 w-16 text-primary" />
            </motion.div>

            {/* Success Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Order Confirmed! 🎉
              </h1>
              <p className="text-lg text-muted-foreground mb-2">
                Thank you for your purchase!
              </p>
              <p className="text-sm text-muted-foreground mb-8">
                We've sent a confirmation email with your order details.
              </p>
            </motion.div>

            {/* Order Details */}
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="bg-destructive/10 text-destructive rounded-lg p-4 mb-8">
                <p>{error}</p>
              </div>
            ) : order ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-4 mb-8"
              >
                <div className="bg-muted/50 rounded-lg p-4 text-sm">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-muted-foreground">Order Reference</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="font-mono font-semibold">{order.id}</p>
                </div>
                
                {order.order_items && order.order_items.length > 0 && (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="font-medium mb-3">Order Items</p>
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                      {order.order_items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          {item.products.images && item.products.images[0] && (
                            <img 
                              src={item.products.images[0]} 
                              alt={item.products.title.en}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium">{item.products.title.en}</p>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Qty: {item.quantity}</span>
                              <span>{formatCurrency(item.unit_price * item.quantity, order.currency)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t mt-3 pt-3">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Total</span>
                        <span className="font-bold text-primary">
                          {formatCurrency(order.total_amount, order.currency)}
                        </span>
                      </div>
                      {order.discount_amount > 0 && (
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>Discount</span>
                          <span>-{formatCurrency(order.discount_amount, order.currency)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="bg-muted/50 rounded-lg p-4 text-sm">
                  <p className="font-medium mb-2">Shipping Details</p>
                  <p className="text-sm">{order.shipping.fullName}</p>
                  <p className="text-sm">{order.shipping.address}</p>
                  <p className="text-sm">{order.shipping.postalCode}, {order.shipping.city}</p>
                  <p className="text-sm">{order.shipping.country}</p>
                </div>
              </motion.div>
            ) : orderId ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-muted/50 rounded-lg p-4 mb-8 text-sm"
              >
                <p className="text-muted-foreground">Order Reference</p>
                <p className="font-mono font-semibold mt-1">{orderId}</p>
              </motion.div>
            ) : null}

            {/* Info Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid md:grid-cols-2 gap-4 mb-8"
            >
              <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg text-left">
                <Package className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm mb-1">Shipping</p>
                  <p className="text-xs text-muted-foreground">
                    Your order will be shipped within 2-3 business days
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg text-left">
                <Mail className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm mb-1">Confirmation Email</p>
                  <p className="text-xs text-muted-foreground">
                    {order?.shipping?.email ? (
                      <>Sent to <span className="font-medium">{order.shipping.email}</span></>
                    ) : (
                      <>Check your inbox for order details and tracking info</>
                    )}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Button
                size="lg"
                onClick={() => navigate('/')}
                className="flex-1"
              >
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/store')}
                className="flex-1"
              >
                Continue Shopping
              </Button>
            </motion.div>

            {/* Support Note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-xs text-muted-foreground mt-8"
            >
              Need help? Contact us at info@syriastore.com
            </motion.p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

