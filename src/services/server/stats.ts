import { db } from '@/config/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

const STATS_COLLECTION = 'stats';
const GLOBAL_DOC = 'global';

export async function incrementTotalMatches() {
  await db.collection(STATS_COLLECTION).doc(GLOBAL_DOC).set(
    { totalMatches: FieldValue.increment(1) },
    { merge: true }
  );
}

export async function getTotalMatches(): Promise<number> {
  const doc = await db.collection(STATS_COLLECTION).doc(GLOBAL_DOC).get();
  return doc.exists && typeof doc.data()?.totalMatches === 'number'
    ? doc.data()!.totalMatches
    : 0;
} 