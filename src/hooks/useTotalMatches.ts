import { useQuery } from '@tanstack/react-query';
import { getTotalMatches } from '@/services/client/cats';

export function useTotalMatches() {
  return useQuery<number>({
    queryKey: ['totalMatches'],
    queryFn: getTotalMatches,
    refetchOnWindowFocus: true,
  });
} 