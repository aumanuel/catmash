jest.mock('../../../config/firebaseAdmin', () => ({
  db: { collection: jest.fn() }
}));

import { getAllCats } from '../cats';
import { db } from '../../../config/firebaseAdmin';
import { Cat } from '../../../types/cat';

describe('cats service', () => {
  let collectionMock: any;

  beforeEach(() => {
    collectionMock = {
      orderBy: jest.fn(),
      get: jest.fn(),
    };
    collectionMock.orderBy.mockReturnValue(collectionMock);
    // @ts-ignore
    db.collection.mockReturnValue(collectionMock);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('retourne un tableau de chats ordonné par score décroissant', async () => {
    const fakeDocs: { id: string; data: () => Cat }[] = [
      { id: 'cat-1', data: () => ({ name: 'A', score: 100, url: 'https://example.com/a.jpg', match: 5, id: 'cat-1' }) },
      { id: 'cat-2', data: () => ({ name: 'B', score: 50, url: 'https://example.com/b.jpg', match: 2, id: 'cat-2' }) },
    ];
    collectionMock.get.mockResolvedValue({ docs: fakeDocs });
    const result = await getAllCats();
    const expected: Cat[] = [
      { id: 'cat-1', name: 'A', score: 100, url: 'https://example.com/a.jpg', match: 5 },
      { id: 'cat-2', name: 'B', score: 50, url: 'https://example.com/b.jpg', match: 2 },
    ];
    expect(db.collection).toHaveBeenCalledWith('cats');
    expect(collectionMock.orderBy).toHaveBeenCalledWith('score', 'desc');
    expect(result).toEqual(expected);
  });

  it('retourne un tableau vide si aucun chat', async () => {
    collectionMock.get.mockResolvedValue({ docs: [] });
    const result: Cat[] = await getAllCats();
    expect(result).toEqual([]);
  });

  it('propage les erreurs Firestore', async () => {
    collectionMock.get.mockRejectedValueOnce(new Error('Firestore error'));
    await expect(getAllCats()).rejects.toThrow('Firestore error');
  });
}); 