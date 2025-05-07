import { useQuery } from '@tanstack/react-query';
import { Cat } from '@/types/cat';

export type MatchResponse = {
  cats: [Cat, Cat];
  token: string;
};

async function getCatMatch(): Promise<MatchResponse> {
  const res = await fetch('/api/cats/match');
  if (!res.ok) throw new Error('Erreur lors de la récupération du match');
  return res.json();
}

export function useCatMatch() {
  return useQuery<MatchResponse>({
    queryKey: ['catMatch'],
    queryFn: getCatMatch,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
} 