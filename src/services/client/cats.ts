import { Cat } from '@/types/cat';
import { http } from '@/services/client/http';

export async function getCats(): Promise<Cat[]> {
  return http<Cat[]>('/api/cats');
}
