import { Timestamp } from 'firebase-admin/firestore';

export const GenericDataStatus = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  ARCHIVED: 'archived',
  PENDING: 'pending',
  DELETED: 'deleted',
} as const;

export type GenericDataStatusType = typeof GenericDataStatus[keyof typeof GenericDataStatus];

export interface GenericData {
  id: string;
  title: string;
  description: string;
  status: GenericDataStatusType;
  tags?: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}

export interface CreateGenericDataDTO {
  title: string;
  description: string;
  tags?: string[];
  status?: GenericDataStatusType;
}

export interface UpdateGenericDataDTO {
  title?: string;
  description?: string;
  tags?: string[];
  status?: GenericDataStatusType;
}

export interface GenericDataListOptions {
  page?: number;
  limit?: number;
  status?: GenericDataStatusType;
  search?: string;
}

export interface GenericMetadata {
  tags?: string[];
  category?: string;
  customFields?: Record<string, unknown>;
  version?: number;
}

export interface PaginatedGenericDataResponse {
  items: GenericData[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface GenericDataEvent {
  type: 'created' | 'updated' | 'deleted' | 'statusChanged';
  data: GenericData;
  timestamp: Timestamp;
  userId: string;
}

export type GenericDataError = {
  code: 'INVALID_STATUS' | 'NOT_FOUND' | 'PERMISSION_DENIED' | 'VALIDATION_ERROR';
  message: string;
  field?: keyof GenericData;
  details?: unknown;
}

export interface GenericDataStats {
  totalCount: number;
  statusCounts: Record<GenericDataStatusType, number>;
  averageVersion: number;
  publicCount: number;
  privateCount: number;
} 