import { GenericData } from '../types/generic-data';
import { Timestamp } from 'firebase-admin/firestore';

export function serializeGenericData(data: GenericData): any {
  return {
    ...data,
    createdAt: (data.createdAt instanceof Timestamp)
      ? data.createdAt.toDate().toISOString()
      : (typeof data.createdAt === 'string' ? data.createdAt : ''),
    updatedAt: (data.updatedAt instanceof Timestamp)
      ? data.updatedAt.toDate().toISOString()
      : (typeof data.updatedAt === 'string' ? data.updatedAt : ''),
  };
}

export function serializeGenericDataArray(items: GenericData[]): any[] {
  return items.map(serializeGenericData);
}

export function serializeCatArray(items: any[]): any[] {
  return items.map(item => ({ ...item }));
} 