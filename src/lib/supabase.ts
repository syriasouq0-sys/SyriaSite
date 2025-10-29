import { createClient, type PostgrestError } from '@supabase/supabase-js';

// Supabase client configuration
// Add your credentials in .env file:
// VITE_SUPABASE_URL=your_supabase_url
// VITE_SUPABASE_ANON_KEY=your_anon_key

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate Supabase configuration
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase configuration missing!');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? '✓ Set' : '✗ Missing');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓ Set' : '✗ Missing');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-client-info': 'syrian-essence-shop',
    },
  },
});

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
    console.log('Fetching products from Supabase...');
    console.log('Supabase URL:', supabaseUrl ? '✓ Set' : '✗ Missing');
    console.log('Supabase Key:', supabaseAnonKey ? '✓ Set (length: ' + supabaseAnonKey.length + ')' : '✗ Missing');
    
    try {
      const startTime = Date.now();
      console.log('Query started, waiting for response...');
      
      const queryPromise = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Add timeout warning
      const timeoutId = setTimeout(() => {
        console.error('Query timeout after 10 seconds - request may be hanging');
      }, 10000);
      
      const result = await queryPromise;
      clearTimeout(timeoutId);
      
      const duration = Date.now() - startTime;
      console.log(`Query completed in ${duration}ms. Data:`, result.data ? 'received (' + (result.data as unknown[]).length + ' items)' : 'null', 'Error:', result.error ? 'yes' : 'no');
      
      const { data, error } = result;
      
      if (error) {
        console.error('Supabase error fetching products:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        });
        // Check if it's an RLS policy error
        if (error.code === '42501' || error.message?.includes('permission denied') || error.message?.includes('RLS')) {
          console.error('RLS Policy Error: Products table may not be accessible to anonymous users.');
          console.error('Please run the fix-products-rls.sql script in your Supabase SQL editor.');
        }
      } else {
        console.log(`Successfully fetched ${data?.length || 0} products`);
      }
      
      return { data, error };
    } catch (err) {
      console.error('Unexpected error fetching products:', err);
      const error = err as Error;
      return { 
        data: null, 
        error: {
          message: error.message || 'Unknown error',
          code: 'UNKNOWN_ERROR',
          details: null,
          hint: null,
        } as PostgrestError
      };
    }
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
    console.log('🔍 [getFeaturedProducts] Starting fetch...');
    console.log('📊 Supabase Config Check:');
    console.log('   URL:', supabaseUrl ? '✓ Set (' + supabaseUrl.substring(0, 30) + '...)' : '✗ Missing');
    console.log('   Key:', supabaseAnonKey ? '✓ Set (' + supabaseAnonKey.length + ' chars)' : '✗ Missing');
    
    try {
      const startTime = Date.now();
      
      // First, let's check if we can even connect to Supabase
      console.log('🔌 Testing Supabase connection...');
      const { data: healthCheck, error: healthError } = await supabase
        .from('products')
        .select('id')
        .limit(1);
      
      if (healthError) {
        console.error('❌ Connection test failed:', healthError);
        if (healthError.code === 'PGRST301' || healthError.message?.includes('relation') || healthError.message?.includes('does not exist')) {
          console.error('🚨 TABLE NOT FOUND! Check if table name is correct.');
          console.error('   Expected: products');
          console.error('   Your table might be named differently or in a different schema.');
          return { data: [], error: null };
        }
      } else {
        console.log('✅ Connection test passed');
      }
      
      // Create a promise that rejects after timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Query timeout - likely RLS policy blocking access'));
        }, 8000);
      });
      
      // Race between query and timeout
      const queryPromise = supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(4);
      
      const result = await Promise.race([queryPromise, timeoutPromise]).catch(async (err) => {
        // If timeout, check if it's really a timeout or if Supabase returned an error
        if (err.message?.includes('timeout')) {
          console.error('⏱️ [getFeaturedProducts] Query TIMED OUT after 8 seconds');
          console.error('🔒 This means RLS policies are BLOCKING access to products table');
          console.error('📝 SOLUTION: Run scripts/fix-products-rls.sql in Supabase SQL Editor');
          console.error('💡 This script allows anonymous users to read products');
          console.error('🔍 TROUBLESHOOTING:');
          console.error('   1. Check Supabase Dashboard → Authentication → Policies');
          console.error('   2. Verify "Anyone can read products" policy exists');
          console.error('   3. Check that RLS is enabled but policy allows SELECT');
          return { data: [], error: null }; // Return empty to prevent infinite loading
        }
        throw err;
      });
      
      const duration = Date.now() - startTime;
      console.log(`⏱️ [getFeaturedProducts] Query took ${duration}ms`);
      
      // Handle timeout result
      if (result && 'data' in result && Array.isArray(result.data)) {
        return result;
      }
      
      const { data, error } = result || { data: null, error: null };
      
      if (error) {
        console.error('❌ [getFeaturedProducts] Supabase error:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        });
        
        if (error.code === '42501' || error.message?.includes('permission denied') || error.message?.includes('RLS')) {
          console.error('🔒 RLS POLICY BLOCKING! Products table not accessible.');
          console.error('📝 SOLUTION: Run scripts/fix-products-rls.sql in Supabase SQL Editor');
          return { data: [], error: null };
        }
        
        return { data: null, error };
      }
      
      console.log(`✅ [getFeaturedProducts] Success! Fetched ${data?.length || 0} products`);
      return { data, error: null };
      
    } catch (err) {
      console.error('💥 [getFeaturedProducts] Unexpected error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      
      if (errorMessage.includes('timeout') || errorMessage.includes('RLS')) {
        console.error('🔒 RLS POLICY ISSUE DETECTED');
        console.error('📝 SOLUTION: Run scripts/fix-products-rls.sql in Supabase SQL Editor');
        return { data: [], error: null }; // Return empty to prevent infinite loading
      }
      
      return { 
        data: [], 
        error: {
          message: errorMessage,
          code: 'UNKNOWN_ERROR',
          details: null,
          hint: null,
        } as PostgrestError
      };
    }
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
    shipping: Record<string, unknown>;
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
