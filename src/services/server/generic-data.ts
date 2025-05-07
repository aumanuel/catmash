import {
  GenericData,
  CreateGenericDataDTO,
  UpdateGenericDataDTO,
  GenericDataListOptions,
  PaginatedGenericDataResponse,
  GenericDataStatus,
} from '../../types/generic-data';
import { db } from '../../config/firebaseAdmin';
import { Timestamp } from 'firebase-admin/firestore';

const COLLECTION = 'generic-data';

export async function getGenericDataList(options: GenericDataListOptions = {}): Promise<PaginatedGenericDataResponse> {
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;
  let query = db.collection(COLLECTION).orderBy('createdAt', 'desc') as FirebaseFirestore.Query;

  if (options.status) {
    query = query.where('status', '==', options.status);
  }
  if (options.search) {
    query = query.where('title', '>=', options.search).where('title', '<=', options.search + '\uf8ff');
  }

  const snapshot = await query.offset((page - 1) * limit).limit(limit).get();
  const items: GenericData[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GenericData));
  const totalSnapshot = await db.collection(COLLECTION).get();
  const total = totalSnapshot.size;
  return {
    items,
    total,
    page,
    limit,
    hasMore: page * limit < total,
  };
}

export async function getGenericDataById(id: string): Promise<GenericData | null> {
  const doc = await db.collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as GenericData;
}

export async function createGenericData(data: CreateGenericDataDTO, userId: string): Promise<GenericData> {
  const now = Timestamp.now();
  const docRef = await db.collection(COLLECTION).add({
    ...data,
    status: data.status ?? GenericDataStatus.DRAFT,
    createdAt: now,
    updatedAt: now,
    createdBy: userId,
  });
  const doc = await docRef.get();
  return { id: doc.id, ...doc.data() } as GenericData;
}

export async function updateGenericData(id: string, data: UpdateGenericDataDTO): Promise<GenericData | null> {
  const docRef = db.collection(COLLECTION).doc(id);
  const doc = await docRef.get();
  if (!doc.exists) return null;
  const updated: Partial<GenericData> = {
    ...data,
    updatedAt: Timestamp.now(),
  };
  await docRef.update(updated);
  const updatedDoc = await docRef.get();
  return { id: updatedDoc.id, ...updatedDoc.data() } as GenericData;
}

export async function deleteGenericData(id: string): Promise<boolean> {
  const docRef = db.collection(COLLECTION).doc(id);
  const doc = await docRef.get();
  if (!doc.exists) return false;
  await docRef.delete();
  return true;
} 