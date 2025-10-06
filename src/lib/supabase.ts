import { createClient } from '@supabase/supabase-js';

// Supabase client configuration
// Add your credentials in .env file:
// VITE_SUPABASE_URL=your_supabase_url
// VITE_SUPABASE_ANON_KEY=your_anon_key

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for common operations

export const supabaseHelpers = {
  // Expose supabase client for advanced queries
  supabase,

  // Events
  async getActiveEvent() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_active', true)
      .gte('end_date', new Date().toISOString())
      .lte('start_date', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    return { data, error };
  },

  // Products
  async getProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async getProductBySlug(slug: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();
    return { data, error };
  },

  async getFeaturedProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(4);
    return { data, error };
  },

  async getProductsByCategory(category: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Orders
  async createOrder(orderData: {
    user_id?: string;
    total_amount: number;
    currency: string;
    shipping: any;
    status?: string;
    discount_code?: string | null;
    discount_amount?: number;
    payment_method?: string;
    payment_id?: string;
    created_at?: string;
  }) {
    const { data, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();
    return { data, error };
  },

  async addOrderItems(orderItems: Array<{
    order_id: string;
    product_id: string;
    quantity: number;
    unit_price: number;
  }>) {
    const { data, error } = await supabase
      .from('order_items')
      .insert(orderItems)
      .select();
    return { data, error };
  },

  async getUserOrders(userId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async updateOrderStatus(orderId: string, status: string) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();
    return { data, error };
  },

  // User Profile
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  async updateUserProfile(userId: string, updates: {
    full_name?: string;
    locale?: string;
    currency?: string;
  }) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  },

  // Storage
  async uploadProductImage(file: File, path: string) {
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });
    return { data, error };
  },

  getProductImageUrl(path: string) {
    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(path);
    return data.publicUrl;
  },
};

// Auth helpers
export const auth = {
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// Example usage in components:
/*
import { supabaseHelpers, auth } from '@/lib/supabase';

// Get products
const { data: products, error } = await supabaseHelpers.getProducts();

// Create order
const { data: order } = await supabaseHelpers.createOrder({
  total_amount: 29900,
  currency: 'SEK',
  shipping: { name: 'John', address: '123 St' }
});

// Sign in
const { data, error } = await auth.signIn('email@example.com', 'password');
*/
