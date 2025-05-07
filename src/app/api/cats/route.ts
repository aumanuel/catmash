import { NextRequest, NextResponse } from 'next/server';
import { getAllCats } from '@/services/server/cats';
import { serializeCatArray } from '@/utils/serialize';
import { catsArraySchema } from '@/validation/cat';

export async function GET(req: NextRequest) {
  try {
    const cats = await getAllCats();
    // Validation Zod sur le tableau de chats
    const parsed = catsArraySchema.safeParse(cats);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid cats data', details: parsed.error.issues }, { status: 500 });
    }
    return NextResponse.json(serializeCatArray(parsed.data));
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 