import { requireActionToken } from '../requireActionToken';
import { verifyActionToken } from '../../utils/actionToken';

jest.mock('../../utils/actionToken', () => ({
  verifyActionToken: jest.fn(),
}));

const VALID_TOKEN = 'valid.token';
const INVALID_TOKEN = 'invalid.token';
const PAYLOAD = { uid: 'user1' };
const ERROR_MISSING = 'Action token manquant';
const ERROR_INVALID = 'Action token invalide ou expiré';

describe('Middleware: requireActionToken', () => {
  const mockVerify = verifyActionToken as jest.Mock;

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Token dans les headers', () => {
    it('retourne le payload pour un token valide', async () => {
      mockVerify.mockResolvedValueOnce(PAYLOAD);
      const req = {
        headers: { get: () => VALID_TOKEN },
        url: 'http://test',
      } as unknown as Request;
      await expect(requireActionToken(req)).resolves.toStrictEqual(PAYLOAD);
      expect(mockVerify).toHaveBeenCalledWith(VALID_TOKEN);
    });

    it('lève une erreur si le token est manquant', async () => {
      const req = {
        headers: { get: () => undefined },
        url: 'http://test',
      } as unknown as Request;
      await expect(requireActionToken(req)).rejects.toThrow(ERROR_MISSING);
    });

    it('lève une erreur si le token est invalide ou expiré', async () => {
      mockVerify.mockRejectedValueOnce(new Error('invalid'));
      const req = {
        headers: { get: () => INVALID_TOKEN },
        url: 'http://test',
      } as unknown as Request;
      await expect(requireActionToken(req)).rejects.toThrow(ERROR_INVALID);
    });
  });

  describe('Token dans la query string', () => {
    it('retourne le payload pour un token valide', async () => {
      mockVerify.mockResolvedValueOnce(PAYLOAD);
      const req = {
        headers: { get: () => undefined },
        url: `http://test/?actionToken=${VALID_TOKEN}`,
      } as unknown as Request;
      await expect(requireActionToken(req, { location: 'query' })).resolves.toStrictEqual(PAYLOAD);
      expect(mockVerify).toHaveBeenCalledWith(VALID_TOKEN);
    });

    it('lève une erreur si le token est manquant', async () => {
      const req = {
        headers: { get: () => undefined },
        url: 'http://test',
      } as unknown as Request;
      await expect(requireActionToken(req, { location: 'query' })).rejects.toThrow(ERROR_MISSING);
    });
  });

  describe('Token dans le corps de la requête', () => {
    it('retourne le payload pour un token valide', async () => {
      mockVerify.mockResolvedValueOnce(PAYLOAD);
      const req = {
        headers: { get: () => undefined },
        url: 'http://test',
        json: async () => ({ actionToken: VALID_TOKEN }),
      } as unknown as Request;
      await expect(requireActionToken(req, { location: 'body' })).resolves.toStrictEqual(PAYLOAD);
      expect(mockVerify).toHaveBeenCalledWith(VALID_TOKEN);
    });

    it('lève une erreur si le token est manquant', async () => {
      const req = {
        headers: { get: () => undefined },
        url: 'http://test',
        json: async () => ({}),
      } as unknown as Request;
      await expect(requireActionToken(req, { location: 'body' })).rejects.toThrow(ERROR_MISSING);
    });
  });

  describe('Gestion des erreurs inattendues', () => {
    it('propage les erreurs inattendues de verifyActionToken', async () => {
      const unexpectedError = new Error('Unexpected');
      mockVerify.mockRejectedValueOnce(unexpectedError);
      const req = {
        headers: { get: () => VALID_TOKEN },
        url: 'http://test',
      } as unknown as Request;
      await expect(requireActionToken(req)).rejects.toThrow(ERROR_INVALID);
    });
  });
}); 