import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseHelpers } from '@/lib/supabase';
import { Product } from '@/types/product';

/**
 * Helper function to safely parse JSON strings
 */
const safeJsonParse = (value: unknown, fallback: unknown = null): unknown => {
  if (typeof value !== 'string') {
    return value;
  }
  
  try {
    return JSON.parse(value);
  } catch (error) {
    console.warn('Failed to parse JSON:', value, error);
    return fallback;
  }
};

/**
 * Helper function to ensure product data has proper structure
 */
const normalizeProduct = (product: Record<string, unknown>): Product | null => {
  try {
    // Safely parse title and description if they're strings
    const titleRaw = safeJsonParse(product.title, {});
    const descriptionRaw = safeJsonParse(product.description, {});

    // Handle cases where title/description might already be objects
    const title = (typeof titleRaw === 'object' && titleRaw !== null) 
      ? titleRaw as Record<string, unknown>
      : {};
    
    const description = (typeof descriptionRaw === 'object' && descriptionRaw !== null)
      ? descriptionRaw as Record<string, unknown>
      : {};

    // Ensure all required language keys exist with fallbacks
    const normalizedTitle = {
      en: (title?.en || title?.['en'] || product.title || '') as string,
      ar: (title?.ar || title?.['ar'] || '') as string,
      sv: (title?.sv || title?.['sv'] || '') as string,
    };

    const normalizedDescription = {
      en: (description?.en || description?.['en'] || product.description || '') as string,
      ar: (description?.ar || description?.['ar'] || '') as string,
      sv: (description?.sv || description?.['sv'] || '') as string,
    };

    // Validate that we have at least a title in one language
    if (!normalizedTitle.en && !normalizedTitle.ar && !normalizedTitle.sv) {
      console.warn('Product missing title:', product.id || 'unknown');
      return null;
    }

    return {
      ...product,
      title: normalizedTitle,
      description: normalizedDescription,
    } as Product;
  } catch (error) {
    console.error('Error normalizing product:', product.id || 'unknown', error);
    return null;
  }
};

/**
 * Hook to fetch all products from Supabase
 */
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        console.log('useProducts: Starting product fetch...');
        const { data, error } = await supabaseHelpers.getProducts();
        
        if (error) {
          console.error('useProducts: Error fetching products:', error);
          console.error('Error details:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint,
          });
          
          // Don't throw on RLS errors - return empty array instead
          if (error.code === '42501' || error.message?.includes('permission denied') || error.message?.includes('RLS')) {
            console.warn('RLS policy blocking access. Returning empty array.');
            return [];
          }
          
          throw error;
        }
        
        const products = (data as Record<string, unknown>[]) || [];
        console.log(`useProducts: Raw products fetched: ${products.length}`);
        
        // Normalize products and filter out invalid ones
        const normalizedProducts = products
          .map(normalizeProduct)
          .filter((product): product is Product => product !== null);
        
        console.log(`useProducts: Normalized products: ${normalizedProducts.length}`);
        
        if (normalizedProducts.length === 0 && products.length > 0) {
          console.warn('All products failed normalization, check product data format');
        }
        
        return normalizedProducts;
      } catch (error) {
        console.error('useProducts: Failed to fetch products:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2, // Retry twice for better reliability
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
};

/**
 * Hook to fetch a single product by slug
 */
export const useProductBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      if (!slug) return null;
      try {
        const { data, error } = await supabaseHelpers.getProductBySlug(slug);
        if (error) {
          // Handle "not found" errors gracefully
          if (error.code === 'PGRST116') {
            return null;
          }
          throw error;
        }
        return data ? normalizeProduct(data) : null;
      } catch (error) {
        console.error('Failed to fetch product by slug:', slug, error);
        throw error;
      }
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

/**
 * Hook to fetch featured products
 */
export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      try {
        console.log('useFeaturedProducts: Starting featured products fetch...');
        const { data, error } = await supabaseHelpers.getFeaturedProducts();
        
        if (error) {
          console.error('useFeaturedProducts: Error fetching featured products:', error);
          console.error('Error details:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint,
          });
          
          // Don't throw on RLS errors - return empty array instead
          if (error.code === '42501' || error.message?.includes('permission denied') || error.message?.includes('RLS')) {
            console.warn('RLS policy blocking access. Returning empty array.');
            return [];
          }
          
          throw error;
        }
        
        const products = (data as Record<string, unknown>[]) || [];
        console.log(`useFeaturedProducts: Raw products fetched: ${products.length}`);
        
        // Normalize products and filter out invalid ones
        const normalizedProducts = products
          .map(normalizeProduct)
          .filter((product): product is Product => product !== null);
        
        console.log(`useFeaturedProducts: Normalized products: ${normalizedProducts.length}`);
        
        return normalizedProducts;
      } catch (error) {
        console.error('useFeaturedProducts: Failed to fetch featured products:', error);
        throw error;
      }
    },
    staleTime: 0, // Don't cache - always fetch fresh to ensure we get latest after RLS fix
    gcTime: 0, // Don't keep in cache
    retry: 1, // Only retry once
    retryDelay: 1000, // 1 second delay
  });
};

/**
 * Hook to fetch products by category
 */
export const useProductsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['products', 'category', category],
    queryFn: async () => {
      try {
        let products: Record<string, unknown>[];
        
        if (!category || category === 'all') {
          const { data, error } = await supabaseHelpers.getProducts();
          if (error) throw error;
          products = (data as Record<string, unknown>[]) || [];
        } else {
          const { data, error } = await supabaseHelpers.getProductsByCategory(category);
          if (error) throw error;
          products = (data as Record<string, unknown>[]) || [];
        }
        
        // Normalize products and filter out invalid ones
        const normalizedProducts = products
          .map(normalizeProduct)
          .filter((product): product is Product => product !== null);
        
        return normalizedProducts;
      } catch (error) {
        console.error('Failed to fetch products by category:', category, error);
        throw error;
      }
    },
    enabled: !!category,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

/**
 * Hook to update product stock (for future admin use)
 */
export const useUpdateProductStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, newStock }: { productId: string; newStock: number }) => {
      const { data, error } = await supabaseHelpers.supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', productId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch products
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

