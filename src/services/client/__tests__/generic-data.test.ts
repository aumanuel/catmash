import {
  getGenericDataList,
  getGenericDataById,
  createGenericData,
  updateGenericData,
  deleteGenericData,
} from '../generic-data';
import { http } from '../http';
import type {
  GenericData,
  CreateGenericDataDTO,
  UpdateGenericDataDTO,
  PaginatedGenericDataResponse,
} from '../../../types/generic-data';

type HttpType = typeof http;

jest.mock('../http');
const mockedHttp = http as jest.MockedFunction<HttpType>;

describe('client/generic-data', () => {
  const genericData: GenericData = Object.freeze({
    id: 'id1',
    title: 'Title',
    description: 'Description',
    status: 'active',
    tags: ['tag1'],
    createdAt: { seconds: 0, nanoseconds: 0 } as any,
    updatedAt: { seconds: 0, nanoseconds: 0 } as any,
    createdBy: 'user1',
  });
  const paginatedResponse: PaginatedGenericDataResponse = Object.freeze({
    items: [genericData],
    total: 1,
    page: 1,
    limit: 10,
    hasMore: false,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getGenericDataList', () => {
    it('calls http with correct query params and returns data', async () => {
      mockedHttp.mockResolvedValueOnce(paginatedResponse);
      const result = await getGenericDataList({ page: 1, limit: 10, status: 'active', search: 'foo' });
      expect(mockedHttp).toHaveBeenCalledWith(
        expect.stringContaining('/api/generic-data?'),
      );
      expect(result).toBe(paginatedResponse);
    });
    it('propagates http errors', async () => {
      mockedHttp.mockRejectedValueOnce(new Error('fail'));
      await expect(getGenericDataList()).rejects.toThrow('fail');
    });
  });

  describe('getGenericDataById', () => {
    it('calls http with correct url and returns data', async () => {
      mockedHttp.mockResolvedValueOnce(genericData);
      const result = await getGenericDataById('id1');
      expect(mockedHttp).toHaveBeenCalledWith('/api/generic-data/id1');
      expect(result).toBe(genericData);
    });
    it('propagates http errors', async () => {
      mockedHttp.mockRejectedValueOnce(new Error('fail'));
      await expect(getGenericDataById('id1')).rejects.toThrow('fail');
    });
  });

  describe('createGenericData', () => {
    const dto: CreateGenericDataDTO = Object.freeze({ title: 'T', description: 'D', tags: ['t'] });
    it('calls http with correct params and returns data (with token)', async () => {
      mockedHttp.mockResolvedValueOnce(genericData);
      const result = await createGenericData(dto, 'token');
      expect(mockedHttp).toHaveBeenCalledWith(
        '/api/generic-data',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(dto),
          headers: expect.objectContaining({ 'X-Action-Token': 'token' }),
        })
      );
      expect(result).toBe(genericData);
    });
    it('calls http with correct params and returns data (without token)', async () => {
      mockedHttp.mockResolvedValueOnce(genericData);
      const result = await createGenericData(dto);
      expect(mockedHttp).toHaveBeenCalledWith(
        '/api/generic-data',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(dto),
          headers: expect.not.objectContaining({ 'X-Action-Token': expect.anything() }),
        })
      );
      expect(result).toBe(genericData);
    });
    it('propagates http errors', async () => {
      mockedHttp.mockRejectedValueOnce(new Error('fail'));
      await expect(createGenericData(dto)).rejects.toThrow('fail');
    });
  });

  describe('updateGenericData', () => {
    const dto: UpdateGenericDataDTO = Object.freeze({ title: 'U' });
    it('calls http with correct params and returns data', async () => {
      mockedHttp.mockResolvedValueOnce(genericData);
      const result = await updateGenericData('id1', dto);
      expect(mockedHttp).toHaveBeenCalledWith(
        '/api/generic-data/id1',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(dto),
        })
      );
      expect(result).toBe(genericData);
    });
    it('propagates http errors', async () => {
      mockedHttp.mockRejectedValueOnce(new Error('fail'));
      await expect(updateGenericData('id1', dto)).rejects.toThrow('fail');
    });
  });

  describe('deleteGenericData', () => {
    it('calls http with correct params', async () => {
      mockedHttp.mockResolvedValueOnce(undefined);
      await deleteGenericData('id1');
      expect(mockedHttp).toHaveBeenCalledWith('/api/generic-data/id1', { method: 'DELETE' });
    });
    it('propagates http errors', async () => {
      mockedHttp.mockRejectedValueOnce(new Error('fail'));
      await expect(deleteGenericData('id1')).rejects.toThrow('fail');
    });
  });
}); 