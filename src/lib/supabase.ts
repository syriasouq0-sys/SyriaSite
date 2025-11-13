import { createClient, type PostgrestError } from '@supabase/supabase-js';

// Supabase client configuration
// Add your credentials in .env file:
// VITE_SUPABASE_URL=your_supabase_url
// VITE_SUPABASE_ANON_KEY=your_anon_key

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate Supabase configuration
if (!supabaseUrl || !supabaseAnonKey) {
  // Supabase configuration missing - silent error
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
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_active', true)
      .gte('end_date', now)
      .lte('start_date', now)
      .order('created_at', { ascending: false })
      .limit(1);
    
    // Return the first result or null if no results
    return { 
      data: data && data.length > 0 ? data[0] : null, 
      error 
    };
  },

  // Products
  async getProducts() {
    try {
      const queryPromise = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      const result = await queryPromise;
      const { data, error } = result;
      
      return { data, error };
    } catch (err) {
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
    try {
      // First, check if we can connect to Supabase
      const { data: healthCheck, error: healthError } = await supabase
        .from('products')
        .select('id')
        .limit(1);
      
      if (healthError) {
        if (healthError.code === 'PGRST301' || healthError.message?.includes('relation') || healthError.message?.includes('does not exist')) {
          return { data: [], error: null };
        }
      }
      
      // Create a promise that rejects after timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Query timeout - likely RLS policy blocking access'));
        }, 8000);
      });
      
      // Fetch featured products
      const featuredQueryPromise = supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(8);
      
      const featuredResult = await Promise.race([featuredQueryPromise, timeoutPromise]).catch(async (err) => {
        if (err.message?.includes('timeout')) {
          return { data: [], error: null };
        }
        throw err;
      });
      
      // Handle timeout result
      let featuredData: Record<string, unknown>[] = [];
      let error = null;
      
      if (featuredResult && 'data' in featuredResult && Array.isArray(featuredResult.data)) {
        featuredData = featuredResult.data;
      } else if (featuredResult && 'error' in featuredResult) {
        const resultError = featuredResult.error;
        if (resultError) {
          if (resultError.code === '42501' || resultError.message?.includes('permission denied') || resultError.message?.includes('RLS')) {
            return { data: [], error: null };
          }
          error = resultError;
        }
      } else {
        const { data: resultData, error: resultError } = featuredResult || { data: null, error: null };
        if (resultError) {
          if (resultError.code === '42501' || resultError.message?.includes('permission denied') || resultError.message?.includes('RLS')) {
            return { data: [], error: null };
          }
          error = resultError;
        } else {
          featuredData = (resultData as Record<string, unknown>[]) || [];
        }
      }
      
      // If we have fewer than 4 featured products, fetch additional latest products to fill up to 4
      if (featuredData.length < 4 && !error) {
        const featuredIds = new Set(featuredData.map(p => p.id));
        const needed = 4 - featuredData.length;
        
        // Fetch latest products and filter out duplicates in JavaScript
        const additionalQueryPromise = supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(needed + 5);
        
        try {
          const additionalResult = await Promise.race([additionalQueryPromise, timeoutPromise]);
          
          let additionalData: Record<string, unknown>[] = [];
          
          if (additionalResult && 'data' in additionalResult && Array.isArray(additionalResult.data)) {
            additionalData = additionalResult.data;
          } else if (additionalResult && 'error' in additionalResult && additionalResult.error) {
            // Silent error handling
          } else {
            const { data: resultData } = additionalResult || { data: null };
            if (resultData) {
              additionalData = resultData as Record<string, unknown>[];
            }
          }
          
          // Filter out products that are already in featuredData
          const uniqueAdditional = additionalData.filter(p => !featuredIds.has(p.id));
          
          // Add unique products to reach 4 total
          featuredData = [...featuredData, ...uniqueAdditional];
        } catch (additionalErr) {
          // Continue with just featured products
        }
      }
      
      // Limit to 4 products total
      const finalData = featuredData.slice(0, 4);
      
      return { data: finalData, error: null };
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      
      if (errorMessage.includes('timeout') || errorMessage.includes('RLS')) {
        return { data: [], error: null };
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
