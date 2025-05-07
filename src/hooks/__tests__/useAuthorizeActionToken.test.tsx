import { renderHook, act } from '@testing-library/react';
import { useAuthorizeActionToken } from '../useAuthorizeActionToken';
import { authorizeActionToken as mockAuthorizeActionToken } from '../../services/client/action-token';

jest.mock('../../services/client/action-token');

describe('useAuthorizeActionToken', () => {
  const action = 'TEST_ACTION' as any;
  const params = { foo: 'bar' };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle successful token request', async () => {
    (mockAuthorizeActionToken as jest.Mock).mockResolvedValue({
      token: 'token123',
      expiresAt: '2024-01-01T00:00:00Z',
    });
    const { result } = renderHook(() => useAuthorizeActionToken());
    await act(async () => {
      await result.current.requestToken(action, params);
    });
    expect(result.current.token).toBe('token123');
    expect(result.current.expiresAt).toBe('2024-01-01T00:00:00Z');
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('should handle error during token request', async () => {
    (mockAuthorizeActionToken as jest.Mock).mockRejectedValue(new Error('fail'));
    const { result } = renderHook(() => useAuthorizeActionToken());
    await act(async () => {
      await result.current.requestToken(action, params);
    });
    expect(result.current.token).toBeNull();
    expect(result.current.expiresAt).toBeNull();
    expect(result.current.error).toBe('fail');
    expect(result.current.loading).toBe(false);
  });
}); 