import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getGenericDataList,
  getGenericDataById,
  createGenericData,
  updateGenericData,
  deleteGenericData,
} from '../services/client/generic-data';
import {
  GenericDataListOptions,
  CreateGenericDataDTO,
  UpdateGenericDataDTO,
} from '../types/generic-data';

export function useGenericDataList(options: GenericDataListOptions = {}) {
  return useQuery({
    queryKey: ['generic-data', options],
    queryFn: () => getGenericDataList(options),
  });
}

export function useGenericData(id: string) {
  return useQuery({
    queryKey: ['generic-data', id],
    queryFn: () => getGenericDataById(id),
    enabled: !!id,
  });
}

export function useCreateGenericData() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, actionToken }: { data: CreateGenericDataDTO; actionToken?: string | null }) =>
      createGenericData(data, actionToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['generic-data'] });
    },
  });
}

export function useUpdateGenericData() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGenericDataDTO }) =>
      updateGenericData(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['generic-data'] });
    },
  });
}

export function useDeleteGenericData() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteGenericData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['generic-data'] });
    },
  });
} 