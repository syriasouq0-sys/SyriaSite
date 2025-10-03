// Stripe integration helpers
// Add your Stripe publishable key in .env:
// VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

// This is the CLIENT-SIDE Stripe integration
// For actual payments, you'll need server-side functions

export const stripeConfig = {
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
};

// Currency conversion helpers
export const currencyHelpers = {
  // Convert to smallest currency unit (e.g., SEK to öre)
  toSmallestUnit(amount: number, currency: string): number {
    const multipliers: Record<string, number> = {
      SEK: 100,
      USD: 100,
      EUR: 100,
    };
    return Math.round(amount * (multipliers[currency] || 100));
  },

  // Convert from smallest unit to display format
  fromSmallestUnit(amount: number, currency: string): number {
    const dividers: Record<string, number> = {
      SEK: 100,
      USD: 100,
      EUR: 100,
    };
    return amount / (dividers[currency] || 100);
  },

  // Format for display
  formatPrice(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  },
};

// Example edge function for creating payment intent
// This should be implemented on the server-side (Supabase Edge Function)
/*
// File: supabase/functions/create-payment-intent/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

serve(async (req) => {
  try {
    const { amount, currency, items } = await req.json()

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        items: JSON.stringify(items),
      },
    })

    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
*/

// Example webhook handler
/*
// File: supabase/functions/stripe-webhook/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

serve(async (req) => {
  const signature = req.headers.get('Stripe-Signature')
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

  try {
    const body = await req.text()
    const event = stripe.webhooks.constructEvent(body, signature!, webhookSecret!)

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object
        // Update order status in database
        // await supabase.from('orders').update({ status: 'completed' })...
        break
      case 'payment_intent.payment_failed':
        // Handle failed payment
        break
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400 }
    )
  }
})
*/

// Client-side helper to call payment intent API
export async function createPaymentIntent(
  amount: number,
  currency: string,
  items: any[]
) {
  try {
    // This would call your Supabase Edge Function
    const response = await fetch('/functions/v1/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: currencyHelpers.toSmallestUnit(amount, currency),
        currency: currency.toLowerCase(),
        items,
      }),
    });

    const { clientSecret, error } = await response.json();

    if (error) {
      throw new Error(error);
    }

    return { clientSecret, error: null };
  } catch (error) {
    return { clientSecret: null, error: error.message };
  }
}

// Example usage in a checkout component:
/*
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { createPaymentIntent, stripeConfig } from '@/lib/stripe';

const stripePromise = loadStripe(stripeConfig.publishableKey);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { getTotalPrice, items } = useCartStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) return;

    const { clientSecret } = await createPaymentIntent(
      getTotalPrice(),
      'SEK',
      items
    );

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-confirmation`,
      },
    });

    if (result.error) {
      console.error(result.error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button type="submit" disabled={!stripe}>Pay</button>
    </form>
  );
}

export default function Checkout() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
*/
