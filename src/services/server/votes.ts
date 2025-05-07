import { db } from '@/config/firebaseAdmin';

const VOTES_COLLECTION = 'votes';

export function getMatchKey(visitorId: string, cat1Id: string, cat2Id: string): string {
  const [idA, idB] = [cat1Id, cat2Id].sort();
  return `${visitorId}_${idA}_${idB}`;
}

export async function hasAlreadyVoted(visitorId: string, cat1Id: string, cat2Id: string): Promise<boolean> {
  const key = getMatchKey(visitorId, cat1Id, cat2Id);
  const doc = await db.collection(VOTES_COLLECTION).doc(key).get();
  return doc.exists;
}

export async function recordVote(visitorId: string, cat1Id: string, cat2Id: string, data: any) {
  const key = getMatchKey(visitorId, cat1Id, cat2Id);
  await db.collection(VOTES_COLLECTION).doc(key).set(data);
} 