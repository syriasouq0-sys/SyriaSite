import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, Loader2, ShieldCheck, Lock } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { mockStripeElements } from '@/lib/mockStripe';

interface StripeCheckoutFormProps {
  shippingInfo: any;
  onBack: () => void;
}

export default function StripeCheckoutForm({ shippingInfo, onBack }: StripeCheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { clearCart, items } = useCartStore();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Use mock stripe if real stripe is not available
    const stripeToUse = stripe || mockStripeElements;
    const elementsToUse = elements;

    if (!stripeToUse) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // If we have real Stripe, use it
      if (stripe && elements) {
        const { error } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/order-confirmation`,
            receipt_email: shippingInfo.email,
            shipping: {
              name: shippingInfo.fullName,
              phone: shippingInfo.phone,
              address: {
                line1: shippingInfo.address,
                city: shippingInfo.city,
                postal_code: shippingInfo.postalCode,
                country: 'SE',
              },
            },
          },
          redirect: 'if_required',
        });

        if (error) {
          setErrorMessage(error.message || 'An error occurred');
          toast.error(error.message || 'Payment failed');
        } else {
          // Payment successful
          toast.success('Payment successful!');
          clearCart();
          navigate('/order-confirmation');
        }
      } else {
        // Use mock implementation for development
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing
        toast.success('Payment successful! (Development Mode)');
        clearCart();
        navigate('/order-confirmation');
      }
    } catch (err: any) {
      setErrorMessage(err.message);
      toast.error('An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Payment Details
          </CardTitle>
          <CardDescription>
            Enter your payment information to complete your order
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Stripe Payment Element */}
            <div className="p-4 border rounded-lg bg-background">
              <PaymentElement 
                options={{
                  layout: 'tabs',
                  wallets: {
                    applePay: 'auto',
                    googlePay: 'auto',
                  },
                }}
              />
            </div>

            {/* Error Message */}
            {errorMessage && (
              <Alert variant="destructive">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            {/* Security Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>SSL Encrypted</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="h-4 w-4 text-primary" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CreditCard className="h-4 w-4 text-primary" />
                <span>Powered by Stripe</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                disabled={isProcessing}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={!stripe || isProcessing}
                className="flex-1"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay Now`
                )}
              </Button>
            </div>
          </form>
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
            <Lock className="h-8 w-8 text-primary" />
            <div>
              <p className="font-semibold text-sm">PCI Compliant</p>
              <p className="text-xs text-muted-foreground">
                Industry-standard security protocols
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

