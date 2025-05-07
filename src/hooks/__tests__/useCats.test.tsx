import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCats } from '../useCats';
import * as catsService from '../../services/client/cats';
import { Cat } from '../../types/cat';

jest.mock('../../services/client/cats');

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useCats hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('retourne un tableau de chats (succès)', async () => {
    const mockCats: Cat[] = [
      { id: 'cat-1', name: 'A', score: 100, url: 'https://example.com/a.jpg', match: 5 },
      { id: 'cat-2', name: 'B', score: 50, url: 'https://example.com/b.jpg', match: 2 },
    ];
    (catsService.getCats as jest.Mock).mockResolvedValueOnce(mockCats);
    const { result } = renderHook(() => useCats(), { wrapper });
    await waitFor(() => expect(result.current.cats).toEqual(mockCats));
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('retourne un tableau vide', async () => {
    (catsService.getCats as jest.Mock).mockResolvedValueOnce([]);
    const { result } = renderHook(() => useCats(), { wrapper });
    await waitFor(() => expect(result.current.cats).toEqual([]));
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('est en loading au début', async () => {
    (catsService.getCats as jest.Mock).mockImplementation(() => new Promise(() => {}));
    const { result } = renderHook(() => useCats(), { wrapper });
    expect(result.current.loading).toBe(true);
  });
}); 