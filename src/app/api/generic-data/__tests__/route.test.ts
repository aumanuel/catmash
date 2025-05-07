const getGenericDataList = jest.fn();
const createGenericData = jest.fn();
const requireActionToken = jest.fn();
const createGenericDataSchema = { parse: jest.fn() };
const serializeGenericData = jest.fn((x: any) => x);
const serializeGenericDataArray = jest.fn((items: any[]) => items);

jest.mock('next/server', () => ({
  NextRequest: class {},
  NextResponse: {
    json: (data: any, init?: any) => ({
      status: init?.status ?? 200,
      json: async () => data,
    }),
  },
}));

describe('/api/generic-data route', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    jest.doMock('@/services/server/generic-data', () => ({
      getGenericDataList,
      createGenericData,
    }));
    jest.doMock('@/middleware/requireActionToken', () => ({
      requireActionToken,
    }));
    jest.doMock('@/validation/generic-data', () => ({
      createGenericDataSchema,
    }));
    jest.doMock('@/utils/serialize', () => ({
      serializeGenericData,
      serializeGenericDataArray,
    }));
  });

  describe('GET', () => {
    it('returns paginated data (200)', async () => {
      getGenericDataList.mockResolvedValue({ items: [{ id: '1', title: 't', createdAt: '', updatedAt: '' }], total: 1, page: 1, limit: 10, hasMore: false });
      serializeGenericDataArray.mockImplementation((items: any[]) => items);
      const { GET } = await import('../route');
      const req = { url: 'http://localhost/api/generic-data?page=1&limit=10', headers: { get: () => null } };
      const res = await GET(req as any);
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.items).toEqual([{ id: '1', title: 't', createdAt: '', updatedAt: '' }]);
      expect(getGenericDataList).toHaveBeenCalledWith({ page: 1, limit: 10, status: undefined, search: undefined });
    });

    it('handles status and search params', async () => {
      getGenericDataList.mockResolvedValue({ items: [], total: 0, page: 2, limit: 5, hasMore: false });
      const { GET } = await import('../route');
      const req = { url: 'http://localhost/api/generic-data?page=2&limit=5&status=PUBLISHED&search=foo', headers: { get: () => null } };
      await GET(req as any);
      expect(getGenericDataList).toHaveBeenCalledWith({ page: 2, limit: 5, status: 'PUBLISHED', search: 'foo' });
    });

    it('returns 400 on service error', async () => {
      getGenericDataList.mockRejectedValue(new Error('fail'));
      const { GET } = await import('../route');
      const req = { url: 'http://localhost/api/generic-data', headers: { get: () => null } };
      const res = await GET(req as any);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toBe('fail');
    });
  });

  describe('POST', () => {
    it('creates data with valid token and body (201)', async () => {
      requireActionToken.mockResolvedValue({ visitorId: 'user1' });
      const body = { title: 't', description: '', tags: [] };
      createGenericDataSchema.parse.mockReturnValue(body);
      createGenericData.mockResolvedValue({ id: '1', ...body, createdAt: '', updatedAt: '' });
      serializeGenericData.mockImplementation((x: any) => x);
      const { POST } = await import('../route');
      const req = {
        headers: { get: () => 'token' },
        json: async () => body,
        url: 'http://localhost/api/generic-data',
      };
      const res = await POST(req as any);
      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.id).toBe('1');
      expect(createGenericData).toHaveBeenCalledWith({ ...body, description: '' }, 'user1');
    });

    it('returns 400 if user not authenticated', async () => {
      requireActionToken.mockResolvedValue({});
      const { POST } = await import('../route');
      const req = { headers: { get: () => 'token' }, json: async () => ({}), url: 'http://localhost/api/generic-data' };
      const res = await POST(req as any);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toMatch(/authentifié/);
    });

    it('returns 400 on validation error', async () => {
      requireActionToken.mockResolvedValue({ visitorId: 'user1' });
      createGenericDataSchema.parse.mockImplementation(() => { throw new Error('invalid'); });
      const { POST } = await import('../route');
      const req = { headers: { get: () => 'token' }, json: async () => ({}), url: 'http://localhost/api/generic-data' };
      const res = await POST(req as any);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toBe('invalid');
    });

    it('returns 400 on service error', async () => {
      requireActionToken.mockResolvedValue({ visitorId: 'user1' });
      createGenericDataSchema.parse.mockReturnValue({ title: 't' });
      createGenericData.mockRejectedValue(new Error('db error'));
      const { POST } = await import('../route');
      const req = { headers: { get: () => 'token' }, json: async () => ({ title: 't' }), url: 'http://localhost/api/generic-data' };
      const res = await POST(req as any);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toBe('db error');
    });

    it('returns 400 if requireActionToken throws', async () => {
      requireActionToken.mockImplementation(() => { throw new Error('token fail'); });
      const { POST } = await import('../route');
      const req = { headers: { get: () => 'token' }, json: async () => ({}), url: 'http://localhost/api/generic-data' };
      const res = await POST(req as any);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toBe('token fail');
    });
  });
}); 