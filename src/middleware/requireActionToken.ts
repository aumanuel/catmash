import { verifyActionToken } from '@/utils/actionToken';

export async function requireActionTokenFromValue(token?: string) {
  if (!token) throw new Error('Action token manquant');
  try {
    return await verifyActionToken(token);
  } catch (err) {
    throw new Error('Action token invalide ou expiré');
  }
} 