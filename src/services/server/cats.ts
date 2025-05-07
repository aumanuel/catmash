import { Cat } from '@/types/cat';
import { db } from '@/config/firebaseAdmin';
import { catSchema } from '@/validation/cat';
import { hasAlreadyVoted } from './votes';

const COLLECTION = 'cats';
const PENDING_MATCHES_COLLECTION = 'pending_matches';

export async function getAllCats(): Promise<Cat[]> {
  const snapshot = await db.collection(COLLECTION).orderBy('score', 'desc').get();
  return snapshot.docs.map(doc => {
    const raw = { id: doc.id, ...doc.data() };
    const parsed = catSchema.safeParse(raw);
    if (!parsed.success) {
      throw new Error(`Invalid cat data for id ${doc.id}: ${JSON.stringify(parsed.error.issues)}`);
    }
    return parsed.data;
  });
}

export async function getCatMatch(): Promise<[Cat, Cat]> {
  const snapshot = await db.collection(COLLECTION).get();
  const cats = snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      match: data.match ?? 0,
    } as Cat;
  });

  if (cats.length < 2) {
    throw new Error('Not enough cats for a match');
  }

  cats.sort((a, b) => {
    if ((a.match ?? 0) !== (b.match ?? 0)) {
      return (a.match ?? 0) - (b.match ?? 0);
    }
    return (a.score ?? 0) - (b.score ?? 0);
  });

  const minMatch = cats[0].match;
  const candidates = cats.filter(cat => cat.match === minMatch);

  const firstCat = candidates[0];

  let secondCat: Cat | undefined = undefined;
  let minEloDiff = Number.POSITIVE_INFINITY;
  for (const cat of candidates) {
    if (cat.id === firstCat.id) continue;
    const diff = Math.abs(cat.score - firstCat.score);
    if (diff < minEloDiff) {
      minEloDiff = diff;
      secondCat = cat;
    }
  }

  if (!secondCat) {
    const nextMatch = cats.find(cat => cat.match > minMatch);
    if (!nextMatch) {
      throw new Error('No second cat available for match');
    }
    secondCat = nextMatch;
  }
  return [firstCat, secondCat];
}

export async function getPendingMatch(visitorId: string) {
  const doc = await db.collection(PENDING_MATCHES_COLLECTION).doc(visitorId).get();
  if (!doc.exists) return null;
  return doc.data();
}

export async function setPendingMatch(visitorId: string, cat1Id: string, cat2Id: string, token: string) {
  await db.collection(PENDING_MATCHES_COLLECTION).doc(visitorId).set({
    visitorId,
    cat1Id,
    cat2Id,
    token,
    createdAt: new Date()
  });
}

export async function clearPendingMatch(visitorId: string) {
  await db.collection(PENDING_MATCHES_COLLECTION).doc(visitorId).delete();
}

export async function updateEloScores(winnerId: string, loserId: string) {
  const winnerRef = db.collection(COLLECTION).doc(winnerId);
  const loserRef = db.collection(COLLECTION).doc(loserId);
  const [winnerSnap, loserSnap] = await Promise.all([winnerRef.get(), loserRef.get()]);
  if (!winnerSnap.exists || !loserSnap.exists) throw new Error('Chat non trouvé');
  const winner = winnerSnap.data() as Cat;
  const loser = loserSnap.data() as Cat;

  const K = 32;
  const expectedWin = 1 / (1 + Math.pow(10, (loser.score - winner.score) / 400));
  const expectedLose = 1 / (1 + Math.pow(10, (winner.score - loser.score) / 400));
  const winnerScore = Math.round(winner.score + K * (1 - expectedWin));
  const loserScore = Math.round(loser.score + K * (0 - expectedLose));

  await Promise.all([
    winnerRef.update({ score: winnerScore, match: (winner.match ?? 0) + 1 }),
    loserRef.update({ score: loserScore, match: (loser.match ?? 0) + 1 }),
  ]);
}

export async function getUnseenCatMatch(visitorId: string): Promise<[Cat, Cat] | null> {
  const snapshot = await db.collection(COLLECTION).get();
  const cats = snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      match: data.match ?? 0,
    } as Cat;
  });
  if (cats.length < 2) return null;

  cats.sort((a, b) => {
    if ((a.match ?? 0) !== (b.match ?? 0)) {
      return (a.match ?? 0) - (b.match ?? 0);
    }
    return (a.score ?? 0) - (b.score ?? 0);
  });

  for (let i = 0; i < cats.length; i++) {
    for (let j = i + 1; j < cats.length; j++) {
      const cat1 = cats[i];
      const cat2 = cats[j];
      if (!(await hasAlreadyVoted(visitorId, cat1.id, cat2.id))) {
        return [cat1, cat2];
      }
    }
  }
  return null;
} 