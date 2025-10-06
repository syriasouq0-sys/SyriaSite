import { useQuery } from '@tanstack/react-query';
import { supabaseHelpers } from '@/lib/supabase';
import { Event } from '@/types/event';

/**
 * Hook to fetch the current active event from Supabase
 */
export const useActiveEvent = () => {
  return useQuery({
    queryKey: ['events', 'active'],
    queryFn: async () => {
      const { data, error } = await supabaseHelpers.getActiveEvent();
      if (error) {
        // If no active event is found, return null instead of throwing an error
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }
      return data as Event;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
