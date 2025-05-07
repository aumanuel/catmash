import { http } from './http';
import {
  GenericData,
  CreateGenericDataDTO,
  UpdateGenericDataDTO,
  GenericDataListOptions,
  PaginatedGenericDataResponse,
} from '../../types/generic-data';

export async function getGenericDataList(options: GenericDataListOptions = {}): Promise<PaginatedGenericDataResponse> {
  const params = new URLSearchParams();
  if (options.page) params.append('page', String(options.page));
  if (options.limit) params.append('limit', String(options.limit));
  if (options.status) params.append('status', options.status);
  if (options.search) params.append('search', options.search);

  return http<PaginatedGenericDataResponse>(
    `/api/generic-data?${params.toString()}`
  );
}

export async function getGenericDataById(id: string): Promise<GenericData> {
  return http<GenericData>(`/api/generic-data/${id}`);
}

export async function createGenericData(
  data: CreateGenericDataDTO,
  actionToken?: string | null
): Promise<GenericData> {
  return http<GenericData>('/api/generic-data', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      ...(actionToken ? { 'X-Action-Token': actionToken } : {}),
    },
  });
}

export async function updateGenericData(id: string, data: UpdateGenericDataDTO): Promise<GenericData> {
  return http<GenericData>(`/api/generic-data/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteGenericData(id: string): Promise<void> {
  await http<void>(`/api/generic-data/${id}`, { method: 'DELETE' });
} 