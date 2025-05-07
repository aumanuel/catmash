const secret = process.env.ACTION_TOKEN_SECRET;
if (process.env.NODE_ENV === 'production' && !secret) {
  throw new Error('ACTION_TOKEN_SECRET doit être défini en production');
}

export const ACTION_TOKEN_SECRET = secret || 'dev-secret-key';
export const ACTION_TOKEN_DEFAULT_EXPIRES_IN = 60 * 5;