jest.mock('../../client/http', () => ({
  http: jest.fn()
}));

import { getCats } from '../cats';
import { http } from '../../client/http';
import { Cat } from '../../../types/cat';

describe('client cats service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('retourne un tableau de chats (succès)', async () => {
    const mockCats: Cat[] = [
      { id: 'cat-1', name: 'A', score: 100, url: 'https://example.com/a.jpg', match: 5 },
      { id: 'cat-2', name: 'B', score: 50, url: 'https://example.com/b.jpg', match: 2 },
    ];
    (http as jest.Mock).mockResolvedValueOnce(mockCats);
    const result: Cat[] = await getCats();
    expect(http).toHaveBeenCalledWith('/api/cats');
    expect(result).toEqual(mockCats);
  });

  it('retourne un tableau vide si aucun chat', async () => {
    (http as jest.Mock).mockResolvedValueOnce([]);
    const result: Cat[] = await getCats();
    expect(result).toEqual([]);
  });

  it('propage les erreurs HTTP', async () => {
    (http as jest.Mock).mockRejectedValueOnce(new Error('HTTP error'));
    await expect(getCats()).rejects.toThrow('HTTP error');
  });
}); 