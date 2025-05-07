import { NextRequest } from 'next/server';

export function getVisitorIdFromCookie(req: NextRequest): string | null {
  const cookie = req.cookies.get('visitor_id');
  return cookie?.value || null;
} 