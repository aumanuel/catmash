import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { signActionToken } from '@/utils/actionToken';
import { ACTION_TOKEN_DEFAULT_EXPIRES_IN } from '@/config/actionToken';
import { ACTION_TOKEN_ACTIONS } from '@/types/actionToken';

const authorizeActionSchema = z.object({
  action: z.enum(ACTION_TOKEN_ACTIONS),
  params: z.record(z.any()).optional(),
});
type AuthorizeActionInput = z.infer<typeof authorizeActionSchema>;

function getVisitorIdFromCookie(req: NextRequest): string | null {
  const cookie = req.cookies.get('visitor_id');
  return cookie?.value || null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = authorizeActionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Action invalide' }, { status: 400 });
    }
    const { action, params }: AuthorizeActionInput = parsed.data;
    const visitorId = getVisitorIdFromCookie(req);
    if (!visitorId) {
      return NextResponse.json({ error: 'Aucun visitorId trouvé dans les cookies' }, { status: 401 });
    }
    const expiresInSeconds = ACTION_TOKEN_DEFAULT_EXPIRES_IN || 300;
    const token = await signActionToken({
      visitorId,
      action,
      params,
      expiresInSeconds,
    });
    const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
    return NextResponse.json({ token, expiresAt: new Date(exp * 1000).toISOString() });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 