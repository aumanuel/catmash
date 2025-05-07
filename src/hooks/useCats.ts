"use client";
import { useQuery } from '@tanstack/react-query';
import { Cat } from '@/types/cat';
import { getCats } from '@/services/client/cats';

export function useCats() {
  const {
    data: cats,
    isLoading: loading,
    error,
    refetch: refresh,
  } = useQuery<Cat[]>({
    queryKey: ['cats'],
    queryFn: getCats,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  return {
    cats,
    loading,
    error: error ? (error as Error).message : null,
    refresh,
  };
} 