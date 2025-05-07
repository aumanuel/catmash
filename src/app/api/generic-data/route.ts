import { NextRequest, NextResponse } from 'next/server';
import { getGenericDataList, createGenericData } from '../../../services/server/generic-data';
import { createGenericDataSchema } from '../../../validation/generic-data';
import { requireActionToken } from '../../../middleware/requireActionToken';
import { serializeGenericData, serializeGenericDataArray } from '../../../utils/serialize';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const statusRaw = searchParams.get('status');
    const status = statusRaw ? statusRaw as import('../../../types/generic-data').GenericDataStatusType : undefined;
    const search = searchParams.get('search') || undefined;
    const data = await getGenericDataList({ page, limit, status, search });
    return NextResponse.json({
      ...data,
      items: serializeGenericDataArray(data.items),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const tokenPayload = await requireActionToken(req);
    const userId = tokenPayload?.visitorId;
    if (!userId) throw new Error('Utilisateur non authentifié');
    const body = await req.json();
    const parsed = createGenericDataSchema.parse(body);
    const safeParsed = { ...parsed, description: parsed.description ?? '' };
    const created = await createGenericData(safeParsed, userId);
    return NextResponse.json(serializeGenericData(created), { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
} 