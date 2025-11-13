import { loadStripe } from '@stripe/stripe-js';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

export const stripePromise = stripePublishableKey 
  ? loadStripe(stripePublishableKey)
  : null;

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const createCheckoutSession = async (data: {
  items: any[];
  shippingInfo: any;
  currency: string;
  discountCode?: string;
  discountAmount?: number;
  subtotal: number;
  shipping: number;
  total: number;
}) => {
  const response = await fetch(`${API_URL}/api/checkout/create-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create checkout session');
  }

  return response.json();
};

export const retrieveCheckoutSession = async (sessionId: string) => {
  const response = await fetch(`${API_URL}/api/checkout/retrieve-session?session_id=${sessionId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to retrieve checkout session');
  }

  return response.json();
};

