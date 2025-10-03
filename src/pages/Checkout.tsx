import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/useCartStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, CreditCard, ArrowLeft, Package } from 'lucide-react';
import { toast } from 'sonner';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, currency, clearCart } = useCartStore();
  const [step, setStep] = useState<'shipping' | 'payment' | 'review'>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Sweden',
  });

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Add some items to your cart before checking out</p>
          <Button onClick={() => navigate('/store')}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate shipping info
    if (!shippingInfo.fullName || !shippingInfo.email || !shippingInfo.address) {
      toast.error('Please fill in all required fields');
      return;
    }
    setStep('payment');
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    // In production, this would call your Stripe integration
    setTimeout(() => {
      toast.success('Order placed successfully!');
      clearCart();
      navigate('/');
      setIsProcessing(false);
    }, 2000);
  };

  const total = getTotalPrice();
  const shipping = total > 500 ? 0 : 49; // Free shipping over 500 SEK
  const finalTotal = total + shipping;

  return (
    <div className="min-h-screen py-12 bg-muted/30">
      <div className="container max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/store')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Store
        </Button>

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-12 gap-2">
          {['shipping', 'payment', 'review'].map((s, idx) => (
            <div key={s} className="flex items-center">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  step === s
                    ? 'bg-primary text-primary-foreground'
                    : steps.indexOf(step) > idx
                    ? 'bg-primary/50 text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {idx + 1}
              </div>
              {idx < 2 && (
                <div
                  className={`h-0.5 w-12 mx-2 ${
                    steps.indexOf(step) > idx ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            {step === 'shipping' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-primary" />
                      Shipping Information
                    </CardTitle>
                    <CardDescription>Enter your delivery details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleShippingSubmit} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name *</Label>
                          <Input
                            id="fullName"
                            value={shippingInfo.fullName}
                            onChange={(e) =>
                              setShippingInfo({ ...shippingInfo, fullName: e.target.value })
                            }
                            placeholder="John Doe"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={shippingInfo.email}
                            onChange={(e) =>
                              setShippingInfo({ ...shippingInfo, email: e.target.value })
                            }
                            placeholder="john@example.com"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={shippingInfo.phone}
                          onChange={(e) =>
                            setShippingInfo({ ...shippingInfo, phone: e.target.value })
                          }
                          placeholder="+46 70 123 4567"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Street Address *</Label>
                        <Input
                          id="address"
                          value={shippingInfo.address}
                          onChange={(e) =>
                            setShippingInfo({ ...shippingInfo, address: e.target.value })
                          }
                          placeholder="123 Main Street"
                          required
                        />
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            value={shippingInfo.city}
                            onChange={(e) =>
                              setShippingInfo({ ...shippingInfo, city: e.target.value })
                            }
                            placeholder="Stockholm"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="postalCode">Postal Code *</Label>
                          <Input
                            id="postalCode"
                            value={shippingInfo.postalCode}
                            onChange={(e) =>
                              setShippingInfo({ ...shippingInfo, postalCode: e.target.value })
                            }
                            placeholder="123 45"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            value={shippingInfo.country}
                            onChange={(e) =>
                              setShippingInfo({ ...shippingInfo, country: e.target.value })
                            }
                            disabled
                          />
                        </div>
                      </div>

                      <Button type="submit" className="w-full" size="lg">
                        Continue to Payment
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Payment Information */}
            {step === 'payment' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      Payment Method
                    </CardTitle>
                    <CardDescription>
                      Payment integration is prepared but not connected yet
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-6 border-2 border-dashed rounded-lg text-center">
                      <CreditCard className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                      <p className="font-semibold mb-2">Stripe Payment Integration</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Connect your Stripe account to accept payments
                      </p>
                      <p className="text-xs text-muted-foreground">
                        See README_SETUP.md for integration instructions
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setStep('shipping')}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="flex-1"
                        size="lg"
                      >
                        {isProcessing ? 'Processing...' : 'Place Order (Demo)'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Trust Indicators */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="flex items-center gap-3 pt-6">
                      <ShieldCheck className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-semibold text-sm">Secure Payment</p>
                        <p className="text-xs text-muted-foreground">
                          Your payment information is encrypted
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="flex items-center gap-3 pt-6">
                      <Truck className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-semibold text-sm">Fast Delivery</p>
                        <p className="text-xs text-muted-foreground">
                          Ships within 2-3 business days
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title.en}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {item.product.title.en}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-semibold">
                          {item.product.price * item.quantity} {currency}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Pricing Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">
                      {total} {currency}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? (
                        <span className="text-primary">Free</span>
                      ) : (
                        `${shipping} ${currency}`
                      )}
                    </span>
                  </div>
                  {total < 500 && shipping > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Add {500 - total} {currency} more for free shipping
                    </p>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">
                    {finalTotal} {currency}
                  </span>
                </div>

                {/* Trust Badge */}
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <span>Secure checkout powered by Stripe</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const steps = ['shipping', 'payment', 'review'];

export default Checkout;
