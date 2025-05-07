const signActionToken = jest.fn();
const ACTION_TOKEN_DEFAULT_EXPIRES_IN = 300;
const ACTION_TOKEN_ACTIONS = [
  'create', 'read', 'update', 'delete', 'submit', 'confirm', 'choose', 'access', 'download',
];

jest.mock('next/server', () => ({
  NextRequest: class {},
  NextResponse: {
    json: (data: any, init?: any) => ({
      status: init?.status ?? 200,
      json: async () => data,
    }),
  },
}));

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
  jest.doMock('@/utils/actionToken', () => ({ signActionToken }));
  jest.doMock('@/config/actionToken', () => ({ ACTION_TOKEN_DEFAULT_EXPIRES_IN }));
  jest.doMock('@/types/actionToken', () => ({ ACTION_TOKEN_ACTIONS }));
});

describe('/api/authorize-action-token route', () => {
  const importRoute = async () => await import('../route');

  function makeReq({ body, visitorId }: { body: any; visitorId?: string }) {
    return {
      json: async () => body,
      cookies: {
        get: (name: string) => (name === 'visitor_id' && visitorId ? { value: visitorId } : undefined),
      },
    };
  }

  it('returns token and expiry on valid request', async () => {
    signActionToken.mockResolvedValue('signed-token');
    const { POST } = await importRoute();
    const req = makeReq({ body: { action: 'create' }, visitorId: 'abc' });
    const res = await POST(req as any);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toHaveProperty('token', 'signed-token');
    expect(json).toHaveProperty('expiresAt');
    expect(signActionToken).toHaveBeenCalledWith(
      expect.objectContaining({ visitorId: 'abc', action: 'create', expiresInSeconds: ACTION_TOKEN_DEFAULT_EXPIRES_IN })
    );
  });

  it('returns 400 on invalid action', async () => {
    const { POST } = await importRoute();
    const req = makeReq({ body: { action: 'invalid' }, visitorId: 'abc' });
    const res = await POST(req as any);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json).toHaveProperty('error');
  });

  it('returns 401 if visitor_id cookie missing', async () => {
    const { POST } = await importRoute();
    const req = makeReq({ body: { action: 'create' } });
    const res = await POST(req as any);
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json).toHaveProperty('error');
  });

  it('returns 500 on internal error', async () => {
    signActionToken.mockImplementation(() => { throw new Error('fail'); });
    const { POST } = await importRoute();
    const req = makeReq({ body: { action: 'create' }, visitorId: 'abc' });
    const res = await POST(req as any);
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json).toHaveProperty('error', 'fail');
  });
}); 