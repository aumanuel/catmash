import { Cat } from '@/types/cat';
import { db } from '@/config/firebaseAdmin';
import { catSchema } from '@/validation/cat';

const COLLECTION = 'cats';

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
