import { NextRequest, NextResponse } from 'next/server';
import { getTotalMatches } from '@/services/server/stats';

export async function GET(req: NextRequest) {
  const total = await getTotalMatches();
  return NextResponse.json({ totalMatches: total });
} 