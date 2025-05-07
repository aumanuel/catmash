import {
  validateCreateGenericData,
  validateUpdateGenericData,
  validateGenericDataListOptions,
  createGenericDataSchema,
  updateGenericDataSchema,
  genericDataListOptionsSchema,
} from '../generic-data';
import { GenericDataStatus } from '../../types/generic-data';

describe('createGenericDataSchema & validateCreateGenericData', () => {
  const minimal = { title: 'A' };
  const full = {
    title: 'A',
    description: 'desc',
    tags: ['x', 'y'],
    status: GenericDataStatus.ACTIVE,
  };

  it('accepte un input minimal valide', () => {
    const result = validateCreateGenericData(minimal);
    expect(result.success).toBe(true);
    expect(result.data).toMatchObject(minimal);
  });

  it('accepte un input complet valide', () => {
    const result = validateCreateGenericData(full);
    expect(result.success).toBe(true);
    expect(result.data).toMatchObject(full);
  });

  it('ne mute jamais l’input', () => {
    const input = { ...full };
    validateCreateGenericData(input);
    expect(input).toEqual(full);
  });

  it('rejette un titre manquant avec le bon message', () => {
    const result = validateCreateGenericData({});
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(['title']);
    expect(result.error?.issues[0].message).toBe('Le titre est requis');
  });

  it('rejette un titre vide avec le bon message', () => {
    const result = validateCreateGenericData({ title: '' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(['title']);
    expect(result.error?.issues[0].message).toBe('Le titre est requis');
  });

  it('rejette un status invalide', () => {
    const result = validateCreateGenericData({ title: 'A', status: 'foo' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(['status']);
  });

  it('accepte les champs optionnels undefined', () => {
    const result = validateCreateGenericData({ title: 'A', description: undefined, tags: undefined, status: undefined });
    expect(result.success).toBe(true);
  });

  it('accepte un tableau tags vide', () => {
    const result = validateCreateGenericData({ title: 'A', tags: [] });
    expect(result.success).toBe(true);
  });

  it.each([
    { tags: [1, 2] },
    { tags: [null] },
    { tags: 'foo' },
  ])('rejette tags non array de string: %p', (tagsCase) => {
    const result = validateCreateGenericData({ title: 'A', ...tagsCase });
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('ignore les champs inconnus (Zod par défaut)', () => {
    const result = createGenericDataSchema.safeParse({ title: 'A', foo: 1 });
    expect(result.success).toBe(true);
    expect(result.data).toHaveProperty('title', 'A');
    expect(result.data).not.toHaveProperty('foo');
  });

  it('rejette les types inattendus (null, undefined, number, array, boolean)', () => {
    [null, undefined, 42, [], true].forEach((input) => {
      const result = validateCreateGenericData(input);
      expect(result.success).toBe(false);
    });
  });
});

describe('updateGenericDataSchema & validateUpdateGenericData', () => {
  it('accepte un objet vide', () => {
    const result = validateUpdateGenericData({});
    expect(result.success).toBe(true);
  });

  it('accepte tous les champs valides', () => {
    const input = {
      title: 'B',
      description: 'desc',
      tags: ['z'],
      status: GenericDataStatus.ARCHIVED,
    };
    const result = validateUpdateGenericData(input);
    expect(result.success).toBe(true);
    expect(result.data).toMatchObject(input);
  });

  it('ne mute jamais l’input', () => {
    const input = { title: 'B' };
    validateUpdateGenericData(input);
    expect(input).toEqual({ title: 'B' });
  });

  it('rejette un titre vide si présent', () => {
    const result = validateUpdateGenericData({ title: '' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(['title']);
    expect(result.error?.issues[0].message).toBe('Le titre est requis');
  });

  it('rejette un status invalide', () => {
    const result = validateUpdateGenericData({ status: 'foo' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(['status']);
  });

  it('accepte un tableau tags vide', () => {
    const result = validateUpdateGenericData({ tags: [] });
    expect(result.success).toBe(true);
  });

  it('rejette tags non array de string', () => {
    const result = validateUpdateGenericData({ tags: [1, 2] });
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('ignore les champs inconnus', () => {
    const result = updateGenericDataSchema.safeParse({ foo: 1 });
    expect(result.success).toBe(true);
    expect(result.data).not.toHaveProperty('foo');
  });
});

describe('genericDataListOptionsSchema & validateGenericDataListOptions', () => {
  it('accepte un objet vide', () => {
    const result = validateGenericDataListOptions({});
    expect(result.success).toBe(true);
  });

  it('accepte toutes les options valides', () => {
    const input = {
      page: 2,
      limit: 10,
      status: GenericDataStatus.DRAFT,
      search: 'foo',
    };
    const result = validateGenericDataListOptions(input);
    expect(result.success).toBe(true);
    expect(result.data).toMatchObject(input);
  });

  it('coerce les string numbers pour page/limit', () => {
    const result = validateGenericDataListOptions({ page: '1', limit: '5' });
    expect(result.success).toBe(true);
    expect(result.data?.page).toBe(1);
    expect(result.data?.limit).toBe(5);
  });

  it('rejette un status invalide', () => {
    const result = validateGenericDataListOptions({ status: 'bad' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(['status']);
  });

  it('rejette page < 1', () => {
    const result = validateGenericDataListOptions({ page: 0 });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(['page']);
  });

  it('rejette limit > 100', () => {
    const result = validateGenericDataListOptions({ limit: 101 });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(['limit']);
  });

  it('rejette limit < 1', () => {
    const result = validateGenericDataListOptions({ limit: 0 });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(['limit']);
  });

  it('ignore les champs inconnus', () => {
    const result = genericDataListOptionsSchema.safeParse({ foo: 1 });
    expect(result.success).toBe(true);
    expect(result.data).not.toHaveProperty('foo');
  });
});

describe('GenericDataStatus enum', () => {
  it.each([
    GenericDataStatus.DRAFT,
    GenericDataStatus.ACTIVE,
    GenericDataStatus.ARCHIVED,
    GenericDataStatus.PENDING,
    GenericDataStatus.DELETED,
  ])('accepte le status valide: %s', (status) => {
    const result = validateCreateGenericData({ title: 'A', status });
    expect(result.success).toBe(true);
  });

  it('rejette un status totalement invalide', () => {
    const result = validateCreateGenericData({ title: 'A', status: 'INVALID' });
    expect(result.success).toBe(false);
  });
});

describe('Robustness: unexpected types', () => {
  it('rejects null, undefined, number, array, boolean as input', () => {
    [null, undefined, 42, [], true].forEach((input) => {
      const result = validateCreateGenericData(input);
      expect(result.success).toBe(false);
    });
  });
}); 