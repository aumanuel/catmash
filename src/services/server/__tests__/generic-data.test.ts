jest.mock('../../../config/firebaseAdmin', () => ({
  db: { collection: jest.fn() }
}));
jest.mock('firebase-admin/firestore', () => ({
  Timestamp: { now: jest.fn() }
}));

import {
  getGenericDataList,
  getGenericDataById,
  createGenericData,
  updateGenericData,
  deleteGenericData,
} from '../generic-data';
import { db } from '../../../config/firebaseAdmin';
import { Timestamp } from 'firebase-admin/firestore';
import {
  GenericData,
  CreateGenericDataDTO,
  UpdateGenericDataDTO,
  GenericDataStatus,
  GenericDataListOptions,
} from '../../../types/generic-data';

const fixedDate = new Date('2023-01-01T00:00:00.000Z');
const fakeTimestamp = { toDate: () => fixedDate } as unknown as Timestamp;
const userId = 'user-123';
const baseData: GenericData = {
  id: 'doc-1',
  title: 'Test Title',
  description: 'Test Desc',
  status: GenericDataStatus.ACTIVE,
  tags: ['tag1'],
  createdAt: fakeTimestamp,
  updatedAt: fakeTimestamp,
  createdBy: userId,
};
const createDTO: CreateGenericDataDTO = {
  title: 'Test Title',
  description: 'Test Desc',
  tags: ['tag1'],
  status: GenericDataStatus.ACTIVE,
};
const updateDTO: UpdateGenericDataDTO = {
  title: 'Updated Title',
  description: 'Updated Desc',
  tags: ['tag2'],
  status: GenericDataStatus.ARCHIVED,
};

let collectionMock: any;
let docMock: any;

beforeEach(() => {
  collectionMock = {
    orderBy: jest.fn(),
    where: jest.fn(),
    offset: jest.fn(),
    limit: jest.fn(),
    get: jest.fn(),
    add: jest.fn(),
    doc: jest.fn(),
  };
  docMock = {
    get: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  collectionMock.orderBy.mockReturnValue(collectionMock);
  collectionMock.where.mockReturnValue(collectionMock);
  collectionMock.offset.mockReturnValue(collectionMock);
  collectionMock.limit.mockReturnValue(collectionMock);
  collectionMock.doc.mockReturnValue(docMock);
  // @ts-ignore
  db.collection.mockReturnValue(collectionMock);
  // @ts-ignore
  Timestamp.now.mockReturnValue(fakeTimestamp);
});
afterEach(() => {
  jest.clearAllMocks();
});

describe('generic-data service (niveau professionnel maximal)', () => {
  describe('getGenericDataList', () => {
    it('retourne une liste paginée (succès)', async () => {
      const fakeDoc = { id: 'doc-1', data: () => ({ ...baseData }) };
      collectionMock.get
        .mockResolvedValueOnce({ docs: [fakeDoc], size: 1 }) // paginated
        .mockResolvedValueOnce({ size: 1 }); // total
      const result = await getGenericDataList({ page: 1, limit: 1 });
      expect(result).toEqual({
        items: [{ id: 'doc-1', ...(() => { const { id, ...rest } = baseData; return rest; })() }],
        total: 1,
        page: 1,
        limit: 1,
        hasMore: false,
      });
      expect(db.collection).toHaveBeenCalledWith('generic-data');
      expect(collectionMock.orderBy).toHaveBeenCalledWith('createdAt', 'desc');
    });
    it('applique les filtres status et search', async () => {
      collectionMock.get.mockResolvedValue({ docs: [], size: 0 });
      await getGenericDataList({ status: GenericDataStatus.ARCHIVED, search: 'foo' });
      expect(collectionMock.where).toHaveBeenCalledWith('status', '==', GenericDataStatus.ARCHIVED);
      expect(collectionMock.where).toHaveBeenCalledWith('title', '>=', 'foo');
      expect(collectionMock.where).toHaveBeenCalledWith('title', '<=', 'foo\uf8ff');
    });
    it('propage les erreurs Firestore', async () => {
      collectionMock.get.mockRejectedValueOnce(new Error('Firestore error'));
      await expect(getGenericDataList()).rejects.toThrow('Firestore error');
    });
  });

  describe('getGenericDataById', () => {
    it('retourne la donnée si trouvée', async () => {
      docMock.get.mockResolvedValueOnce({ exists: true, id: 'doc-1', data: () => ({ ...baseData }) });
      const result = await getGenericDataById('doc-1');
      expect(result).toEqual({ id: 'doc-1', ...(() => { const { id, ...rest } = baseData; return rest; })() });
      expect(db.collection).toHaveBeenCalledWith('generic-data');
      expect(collectionMock.doc).toHaveBeenCalledWith('doc-1');
    });
    it('retourne null si non trouvée', async () => {
      docMock.get.mockResolvedValueOnce({ exists: false });
      const result = await getGenericDataById('notfound');
      expect(result).toBeNull();
    });
    it('propage les erreurs Firestore', async () => {
      docMock.get.mockRejectedValueOnce(new Error('Firestore error'));
      await expect(getGenericDataById('doc-1')).rejects.toThrow('Firestore error');
    });
  });

  describe('createGenericData', () => {
    it('crée et retourne la donnée (succès)', async () => {
      const docData = { ...createDTO, status: createDTO.status, createdAt: fakeTimestamp, updatedAt: fakeTimestamp, createdBy: userId };
      const docRef = { get: jest.fn().mockResolvedValue({ id: 'doc-1', data: () => docData }) };
      collectionMock.add.mockResolvedValueOnce(docRef);
      const result = await createGenericData(createDTO, userId);
      expect(collectionMock.add).toHaveBeenCalledWith(expect.objectContaining({ title: createDTO.title, createdBy: userId }));
      expect(result).toEqual({ id: 'doc-1', ...docData });
      expect(Timestamp.now).toHaveBeenCalledTimes(1);
    });
    it('ne mute pas les entrées', async () => {
      const input = { ...createDTO };
      const docRef = { get: jest.fn().mockResolvedValue({ id: 'doc-1', data: () => ({ ...input, createdAt: fakeTimestamp, updatedAt: fakeTimestamp, createdBy: userId }) }) };
      collectionMock.add.mockResolvedValueOnce(docRef);
      await createGenericData(input, userId);
      expect(input).toEqual(createDTO);
    });
    it('propage les erreurs Firestore', async () => {
      collectionMock.add.mockRejectedValueOnce(new Error('Firestore error'));
      await expect(createGenericData(createDTO, userId)).rejects.toThrow('Firestore error');
    });
  });

  describe('updateGenericData', () => {
    it('met à jour et retourne la donnée si trouvée', async () => {
      docMock.get
        .mockResolvedValueOnce({ exists: true }) // check exists
        .mockResolvedValueOnce({ id: 'doc-1', data: () => ({ ...baseData, ...updateDTO, updatedAt: fakeTimestamp }) }); // after update
      const result = await updateGenericData('doc-1', updateDTO);
      expect(docMock.update).toHaveBeenCalledWith(expect.objectContaining({ ...updateDTO, updatedAt: fakeTimestamp }));
      expect(result).toEqual({ id: 'doc-1', ...(() => { const { id, ...rest } = baseData; return { ...rest, ...updateDTO, updatedAt: fakeTimestamp }; })() });
      expect(Timestamp.now).toHaveBeenCalled();
    });
    it('retourne null si non trouvée', async () => {
      docMock.get.mockResolvedValueOnce({ exists: false });
      const result = await updateGenericData('notfound', updateDTO);
      expect(result).toBeNull();
    });
    it('ne mute pas les entrées', async () => {
      docMock.get.mockResolvedValueOnce({ exists: true }).mockResolvedValueOnce({ id: 'doc-1', data: () => ({ ...baseData, ...updateDTO, updatedAt: fakeTimestamp }) });
      const input = { ...updateDTO };
      await updateGenericData('doc-1', input);
      expect(input).toEqual(updateDTO);
    });
    it('propage les erreurs Firestore', async () => {
      docMock.get.mockResolvedValueOnce({ exists: true });
      docMock.update.mockRejectedValueOnce(new Error('Firestore error'));
      await expect(updateGenericData('doc-1', updateDTO)).rejects.toThrow('Firestore error');
    });
  });

  describe('deleteGenericData', () => {
    it('supprime et retourne true si trouvée', async () => {
      docMock.get.mockResolvedValueOnce({ exists: true });
      const result = await deleteGenericData('doc-1');
      expect(docMock.delete).toHaveBeenCalled();
      expect(result).toBe(true);
    });
    it('retourne false si non trouvée', async () => {
      docMock.get.mockResolvedValueOnce({ exists: false });
      const result = await deleteGenericData('notfound');
      expect(result).toBe(false);
    });
    it('propage les erreurs Firestore', async () => {
      docMock.get.mockResolvedValueOnce({ exists: true });
      docMock.delete.mockRejectedValueOnce(new Error('Firestore error'));
      await expect(deleteGenericData('doc-1')).rejects.toThrow('Firestore error');
    });
  });

  describe('robustesse et arguments invalides', () => {
    it('retourne une liste vide si aucun document', async () => {
      collectionMock.get.mockResolvedValueOnce({ docs: [], size: 0 }).mockResolvedValueOnce({ size: 0 });
      const result = await getGenericDataList({});
      expect(result.items).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.hasMore).toBe(false);
    });
    it('tolère les options de pagination invalides', async () => {
      collectionMock.get.mockResolvedValue({ docs: [], size: 0 });
      await expect(getGenericDataList({ page: -1, limit: 0 } as unknown as GenericDataListOptions)).resolves.toBeDefined();
    });
    it('tolère un id vide pour getGenericDataById', async () => {
      docMock.get.mockResolvedValueOnce({ exists: false });
      const result = await getGenericDataById('');
      expect(result).toBeNull();
    });
  });
}); 