import { useState, useCallback } from 'react';
import { ActionTokenAction } from '../types/actionToken';
import { authorizeActionToken, AuthorizeActionTokenResponse } from '../services/client/action-token';

interface UseAuthorizeActionTokenResult {
  token: string | null;
  expiresAt: string | null;
  loading: boolean;
  error: string | null;
  requestToken: (action: ActionTokenAction, params?: Record<string, any>) => Promise<void>;
}

export function useAuthorizeActionToken(): UseAuthorizeActionTokenResult {
  const [token, setToken] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestToken = useCallback(async (action: ActionTokenAction, params?: Record<string, any>) => {
    setLoading(true);
    setError(null);
    try {
      const res: AuthorizeActionTokenResponse = await authorizeActionToken(action, params);
      setToken(res.token);
      setExpiresAt(res.expiresAt);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la demande de token d\'autorisation');
      setToken(null);
      setExpiresAt(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return { token, expiresAt, loading, error, requestToken };
} 