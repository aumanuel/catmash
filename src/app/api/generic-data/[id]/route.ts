import { NextRequest, NextResponse } from 'next/server';
import { getGenericDataById, updateGenericData, deleteGenericData } from '../../../../services/server/generic-data';
import { updateGenericDataSchema } from '../../../../validation/generic-data';
import { requireActionToken } from '../../../../middleware/requireActionToken';
import { serializeGenericData } from '../../../../utils/serialize';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await getGenericDataById(id);
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(serializeGenericData(data));
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireActionToken(req);
    const { id } = await params;
    const body = await req.json();
    const parsed = updateGenericDataSchema.parse(body);
    const safeParsed = { ...parsed, description: parsed.description ?? '' };
    const updated = await updateGenericData(id, safeParsed);
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(serializeGenericData(updated));
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireActionToken(req);
    const { id } = await params;
    const ok = await deleteGenericData(id);
    if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({}, { status: 204 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
} 