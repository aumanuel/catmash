import { ActionTokenAction } from '@/types/actionToken';

export interface AuthorizeActionTokenResponse {
  token: string;
  expiresAt: string;
}

export async function authorizeActionToken(
  action: ActionTokenAction,
  params?: Record<string, any>
): Promise<AuthorizeActionTokenResponse> {
  const res = await fetch('/api/authorize-action-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action, params }),
    credentials: 'include',
  });
  if (!res.ok) {
    let errorMsg = "Erreur lors de la demande de token d'autorisation";
    try {
      if (typeof res.json === 'function') {
        const error = await res.json();
        if (error && typeof error === 'object' && typeof error.error === 'string') {
          errorMsg = error.error;
        }
      }
    } catch {
      // ignore, use default errorMsg
    }
    throw new Error(errorMsg);
  }
  return res.json();
} 