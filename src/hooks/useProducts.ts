import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseHelpers } from '@/lib/supabase';
import { Product } from '@/types/product';

/**
 * Hook to fetch all products from Supabase
 */
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabaseHelpers.getProducts();
      if (error) throw error;
      return (data as Product[]) || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
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
      const { data, error } = await supabaseHelpers.getProductBySlug(slug);
      if (error) throw error;
      return data as Product;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to fetch featured products
 */
export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabaseHelpers.getFeaturedProducts();
      if (error) throw error;
      return (data as Product[]) || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to fetch products by category
 */
export const useProductsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['products', 'category', category],
    queryFn: async () => {
      if (!category || category === 'all') {
        const { data, error } = await supabaseHelpers.getProducts();
        if (error) throw error;
        return (data as Product[]) || [];
      }
      const { data, error } = await supabaseHelpers.getProductsByCategory(category);
      if (error) throw error;
      return (data as Product[]) || [];
    },
    enabled: !!category,
    staleTime: 1000 * 60 * 5, // 5 minutes
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

