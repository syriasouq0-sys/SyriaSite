// Mock Stripe implementation for local development
// This simulates the payment intent creation without needing the Supabase Edge Function

/**
 * Creates a mock payment intent client secret
 * In production, this would call the Stripe API through a server endpoint
 */
export async function createMockPaymentIntent(
  amount: number,
  currency: string,
  items: any[],
  shipping: any,
  discountCode: string | null
): Promise<{ clientSecret: string }> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate a fake client secret that looks exactly like a real one
  // Real Stripe secrets are in format: pi_1234567890_secret_1234567890
  const id = `pi_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
  const secret = `secret_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
  const mockSecret = `${id}_${secret}`;
  
  // Log the payment details for debugging
  console.log('Creating mock payment intent:', {
    amount,
    currency,
    items: items.length,
    shipping: shipping.fullName,
    discountCode,
    mockSecret
  });
  
  return { clientSecret: mockSecret };
}

/**
 * Mock Stripe Elements that can be used for development
 */
export const mockStripeElements = {
  // This creates a fake Elements instance that works with the Stripe Elements component
  create: () => ({
    createElement: () => ({
      mount: () => {},
      unmount: () => {},
      on: () => {},
      update: () => {},
    }),
    getElement: () => null,
  }),
  // Mock confirmPayment method
  confirmPayment: async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return a successful result
    return { paymentIntent: { status: 'succeeded' }, error: null };
  }
};
