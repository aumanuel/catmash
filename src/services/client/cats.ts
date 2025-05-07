import { Cat } from '@/types/cat';
import { http } from '@/services/client/http';

export async function getCats(): Promise<Cat[]> {
  return http<Cat[]>('/api/cats');
}

export async function voteForMatch({ token, winnerId, loserId }: { token: string; winnerId: string; loserId: string }) {
  return http<{ success: boolean }>('/api/cats/match/vote', {
    method: 'POST',
    body: JSON.stringify({ actionToken: token, winnerId, loserId }),
  });
}

export async function getTotalMatches(): Promise<number> {
  const res = await http<{ totalMatches: number }>('/api/stats/total-matches');
  return res.totalMatches;
} 