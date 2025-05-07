import { GenericData, GenericDataStatus } from '@/types/generic-data';
import { Timestamp } from 'firebase-admin/firestore';

jest.mock('@/services/server/generic-data');
jest.mock('@/middleware/requireActionToken');
jest.mock('@/validation/generic-data');
jest.mock('@/utils/serialize');

jest.mock('next/server', () => ({
  NextRequest: class {},
  NextResponse: {
    json: (data: any, init?: any) => ({
      status: init?.status ?? 200,
      json: async () => data,
    }),
  },
}));

const getGenericDataById = jest.fn();
const updateGenericData = jest.fn();
const deleteGenericData = jest.fn();
const requireActionToken = jest.fn();
const updateGenericDataSchema = { parse: jest.fn() };
const serializeGenericData = jest.fn((x: any) => x);

type MockRequest = { json?: () => Promise<any>; url?: string; headers?: { get: (name: string) => string | null } };

describe('/api/generic-data/[id] route', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    jest.doMock('@/services/server/generic-data', () => ({
      getGenericDataById,
      updateGenericData,
      deleteGenericData,
    }));
    jest.doMock('@/middleware/requireActionToken', () => ({
      requireActionToken,
    }));
    jest.doMock('@/validation/generic-data', () => ({
      updateGenericDataSchema,
    }));
    jest.doMock('@/utils/serialize', () => ({
      serializeGenericData,
    }));
  });

  describe('GET', () => {
    it('returns 200 and serialized data if found', async () => {
      const data: GenericData = { id: '1', title: 't', description: '', tags: [], status: GenericDataStatus.DRAFT, createdAt: Timestamp.now(), updatedAt: Timestamp.now(), createdBy: 'u' };
      getGenericDataById.mockResolvedValue(data);
      serializeGenericData.mockReturnValue({ ...data, foo: 'bar' });
      const { GET } = await import('../route');
      const req: MockRequest = { headers: { get: () => null } };
      const res = await GET(req as any, { params: { id: '1' } });
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toEqual({ ...data, foo: 'bar' });
      expect(getGenericDataById).toHaveBeenCalledWith('1');
      expect(serializeGenericData).toHaveBeenCalledWith(data);
    });
    it('returns 404 if not found', async () => {
      getGenericDataById.mockResolvedValue(null);
      const { GET } = await import('../route');
      const req: MockRequest = { headers: { get: () => null } };
      const res = await GET(req as any, { params: { id: '1' } });
      expect(res.status).toBe(404);
      const json = await res.json();
      expect(json).toHaveProperty('error');
    });
    it('returns 400 on service error', async () => {
      getGenericDataById.mockRejectedValue(new Error('fail'));
      const { GET } = await import('../route');
      const req: MockRequest = { headers: { get: () => null } };
      const res = await GET(req as any, { params: { id: '1' } });
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json).toHaveProperty('error', 'fail');
    });
  });

  describe('PUT', () => {
    const validBody = { title: 'T', description: 'D', tags: [], status: GenericDataStatus.DRAFT };
    const updatedData: GenericData = { id: '1', ...validBody, createdAt: Timestamp.now(), updatedAt: Timestamp.now(), createdBy: 'u' };
    it('returns 200 and serialized data if update succeeds', async () => {
      requireActionToken.mockResolvedValue({});
      updateGenericDataSchema.parse.mockReturnValue(validBody);
      updateGenericData.mockResolvedValue(updatedData);
      serializeGenericData.mockReturnValue({ ...updatedData, foo: 'bar' });
      const { PUT } = await import('../route');
      const req: MockRequest = { json: async () => validBody, headers: { get: () => null } };
      const res = await PUT(req as any, { params: { id: '1' } });
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toEqual({ ...updatedData, foo: 'bar' });
      expect(requireActionToken).toHaveBeenCalled();
      expect(updateGenericDataSchema.parse).toHaveBeenCalledWith(validBody);
      expect(updateGenericData).toHaveBeenCalledWith('1', { ...validBody, description: 'D' });
      expect(serializeGenericData).toHaveBeenCalledWith(updatedData);
    });
    it('returns 404 if updateGenericData returns null', async () => {
      requireActionToken.mockResolvedValue({});
      updateGenericDataSchema.parse.mockReturnValue(validBody);
      updateGenericData.mockResolvedValue(null);
      const { PUT } = await import('../route');
      const req: MockRequest = { json: async () => validBody, headers: { get: () => null } };
      const res = await PUT(req as any, { params: { id: '1' } });
      expect(res.status).toBe(404);
      const json = await res.json();
      expect(json).toHaveProperty('error');
    });
    it('returns 400 if requireActionToken throws', async () => {
      requireActionToken.mockRejectedValue(new Error('bad token'));
      const { PUT } = await import('../route');
      const req: MockRequest = { json: async () => validBody, headers: { get: () => null } };
      const res = await PUT(req as any, { params: { id: '1' } });
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json).toHaveProperty('error', 'bad token');
    });
    it('returns 400 if validation fails', async () => {
      requireActionToken.mockResolvedValue({});
      updateGenericDataSchema.parse.mockImplementation(() => { throw new Error('invalid'); });
      const { PUT } = await import('../route');
      const req: MockRequest = { json: async () => validBody, headers: { get: () => null } };
      const res = await PUT(req as any, { params: { id: '1' } });
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json).toHaveProperty('error', 'invalid');
    });
    it('returns 400 on updateGenericData error', async () => {
      requireActionToken.mockResolvedValue({});
      updateGenericDataSchema.parse.mockReturnValue(validBody);
      updateGenericData.mockRejectedValue(new Error('fail'));
      const { PUT } = await import('../route');
      const req: MockRequest = { json: async () => validBody, headers: { get: () => null } };
      const res = await PUT(req as any, { params: { id: '1' } });
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json).toHaveProperty('error', 'fail');
    });
  });

  describe('DELETE', () => {
    it('returns 204 if deleteGenericData returns true', async () => {
      requireActionToken.mockResolvedValue({});
      deleteGenericData.mockResolvedValue(true);
      const { DELETE } = await import('../route');
      const req: MockRequest = { headers: { get: () => null } };
      const res = await DELETE(req as any, { params: { id: '1' } });
      expect(res.status).toBe(204);
    });
    it('returns 404 if deleteGenericData returns false', async () => {
      requireActionToken.mockResolvedValue({});
      deleteGenericData.mockResolvedValue(false);
      const { DELETE } = await import('../route');
      const req: MockRequest = { headers: { get: () => null } };
      const res = await DELETE(req as any, { params: { id: '1' } });
      expect(res.status).toBe(404);
    });
    it('returns 400 if requireActionToken throws', async () => {
      requireActionToken.mockRejectedValue(new Error('bad token'));
      const { DELETE } = await import('../route');
      const req: MockRequest = { headers: { get: () => null } };
      const res = await DELETE(req as any, { params: { id: '1' } });
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json).toHaveProperty('error', 'bad token');
    });
    it('returns 400 on deleteGenericData error', async () => {
      requireActionToken.mockResolvedValue({});
      deleteGenericData.mockRejectedValue(new Error('fail'));
      const { DELETE } = await import('../route');
      const req: MockRequest = { headers: { get: () => null } };
      const res = await DELETE(req as any, { params: { id: '1' } });
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json).toHaveProperty('error', 'fail');
    });
  });
}); 