import { authorizeActionToken, AuthorizeActionTokenResponse } from '../action-token';
import { ACTION_TOKEN_ACTIONS, ActionTokenAction } from '../../../types/actionToken';

const ENDPOINT = '/api/authorize-action-token';

describe('authorizeActionToken', () => {
  const mockTokenResponse: AuthorizeActionTokenResponse = {
    token: 'mocked.jwt.token',
    expiresAt: new Date(Date.now() + 60_000).toISOString(),
  };

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete (global as any).fetch;
  });

  function getLastFetchOptions(): RequestInit {
    const calls = (global.fetch as jest.Mock).mock.calls;
    return calls[calls.length - 1][1] as RequestInit;
  }

  it('should POST to the correct endpoint with proper payload, headers, and credentials, and return the token response', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTokenResponse,
    });

    const action: ActionTokenAction = 'create';
    const params = { foo: 'bar' };
    const result = await authorizeActionToken(action, params);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(ENDPOINT, expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ action, params }),
    }));
    expect(result).toEqual(mockTokenResponse);
  });

  it('should include params as undefined if not provided', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTokenResponse,
    });

    const action: ActionTokenAction = 'read';
    await authorizeActionToken(action);

    const options = getLastFetchOptions();
    expect(JSON.parse((options.body as string))).toEqual({ action, params: undefined });
  });

  it('should throw with error message from response if not ok and response has JSON error', async () => {
    const errorMsg = 'Custom error';
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: errorMsg }),
    });

    await expect(authorizeActionToken('update')).rejects.toThrow(errorMsg);
  });

  it('should throw generic error if not ok and response is not valid JSON', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => { throw new Error('Invalid JSON'); },
    });

    await expect(authorizeActionToken('delete')).rejects.toThrow('Erreur lors de la demande de token d\'autorisation');
  });

  it('should propagate network errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network down'));

    await expect(authorizeActionToken('submit')).rejects.toThrow('Network down');
  });

  it('should send credentials: include in the request', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTokenResponse,
    });

    await authorizeActionToken('confirm');
    const options = getLastFetchOptions();
    expect(options.credentials).toBe('include');
  });

  it('should send the correct headers', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTokenResponse,
    });

    await authorizeActionToken('choose');
    const options = getLastFetchOptions();
    expect(options.headers).toEqual({ 'Content-Type': 'application/json' });
  });

  it('should work for all valid ActionTokenAction values', async () => {
    expect.assertions(ACTION_TOKEN_ACTIONS.length * 2);

    for (const action of ACTION_TOKEN_ACTIONS) {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTokenResponse,
      });

      const result = await authorizeActionToken(action);
      expect(global.fetch).toHaveBeenLastCalledWith(ENDPOINT, expect.objectContaining({
        body: JSON.stringify({ action, params: undefined }),
      }));
      expect(result).toEqual(mockTokenResponse);
    }
  });

  it('should throw if fetch returns a response without a json method', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    await expect(authorizeActionToken('access')).rejects.toThrow('Erreur lors de la demande de token d\'autorisation');
  });

  it('should throw if fetch returns a non-object', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => null,
    });

    await expect(authorizeActionToken('download')).rejects.toThrow('Erreur lors de la demande de token d\'autorisation');
  });
});