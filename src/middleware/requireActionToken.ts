import { NextRequest } from 'next/server';
import { verifyActionToken } from '../utils/actionToken';

export async function requireActionToken(
  req: NextRequest | Request,
  options: { location?: 'header' | 'body' | 'query'; headerName?: string } = {}
) {
  const { location = 'header', headerName = 'x-action-token' } = options;
  let token: string | undefined;

  if (location === 'header') {
    token = req.headers.get(headerName) || undefined;
  } else if (location === 'query') {
    const url = new URL(req.url);
    token = url.searchParams.get('actionToken') || undefined;
  } else if (location === 'body') {
    const body = await (req as Request).json().catch(() => ({}));
    token = body.actionToken;
  }

  if (!token) {
    throw new Error('Action token manquant');
  }

  try {
    return await verifyActionToken(token);
  } catch (err) {
    throw new Error('Action token invalide ou expiré');
  }
} 