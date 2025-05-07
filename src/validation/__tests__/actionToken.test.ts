import { actionTokenPayloadSchema, validateActionTokenPayload } from '../actionToken';
import { ACTION_TOKEN_ACTIONS, ActionTokenAction } from '../../types/actionToken';

type MinimalPayload = {
  visitorId: string;
  action: ActionTokenAction;
  exp: number;
  params?: Record<string, unknown>;
};

describe('actionTokenPayloadSchema', () => {
  const base: MinimalPayload = {
    visitorId: 'visitor-1',
    action: ACTION_TOKEN_ACTIONS[0],
    exp: 1234567890,
  };

  describe('valid cases', () => {
    it('accepts a minimal valid payload', () => {
      expect(actionTokenPayloadSchema.safeParse(base).success).toBe(true);
    });

    it('accepts all allowed actions', () => {
      for (const action of ACTION_TOKEN_ACTIONS) {
        expect(actionTokenPayloadSchema.safeParse({ ...base, action }).success).toBe(true);
      }
    });

    it('accepts with optional params (object)', () => {
      const payload = { ...base, params: { foo: 'bar', n: 1, b: true } };
      expect(actionTokenPayloadSchema.safeParse(payload).success).toBe(true);
    });

    it('accepts with empty params object', () => {
      const payload = { ...base, params: {} };
      expect(actionTokenPayloadSchema.safeParse(payload).success).toBe(true);
    });
  });

  describe('invalid visitorId', () => {
    it.each([
      { value: '', desc: 'empty string' },
      { value: undefined, desc: 'missing' },
      { value: null, desc: 'null' },
      { value: 123, desc: 'number' },
      { value: {}, desc: 'object' },
    ])('rejects visitorId: $desc', ({ value }) => {
      const payload = { ...base, visitorId: value };
      const result = actionTokenPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
      expect(result.error?.issues.some(i => i.path[0] === 'visitorId')).toBe(true);
    });
  });

  describe('invalid action', () => {
    it('rejects missing action', () => {
      const { action, ...payload } = base;
      const result = actionTokenPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
      expect(result.error?.issues.some(i => i.path[0] === 'action')).toBe(true);
    });
    it.each([
      { value: 'not-allowed', desc: 'invalid string' },
      { value: 123, desc: 'number' },
      { value: null, desc: 'null' },
      { value: {}, desc: 'object' },
    ])('rejects action: $desc', ({ value }) => {
      const payload = { ...base, action: value };
      const result = actionTokenPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
      expect(result.error?.issues.some(i => i.path[0] === 'action')).toBe(true);
    });
  });

  describe('invalid exp', () => {
    it('rejects missing exp', () => {
      const { exp, ...payload } = base;
      const result = actionTokenPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
      expect(result.error?.issues.some(i => i.path[0] === 'exp')).toBe(true);
    });
    it.each([
      { value: 0, desc: 'zero' },
      { value: -1, desc: 'negative' },
      { value: 123.45, desc: 'float' },
      { value: '123', desc: 'string' },
      { value: null, desc: 'null' },
      { value: undefined, desc: 'undefined' },
    ])('rejects exp: $desc', ({ value }) => {
      const payload = { ...base, exp: value };
      const result = actionTokenPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
      expect(result.error?.issues.some(i => i.path[0] === 'exp')).toBe(true);
    });
  });

  describe('invalid params', () => {
    it.each([
      { value: 123, desc: 'number' },
      { value: 'foo', desc: 'string' },
      { value: null, desc: 'null' },
      { value: [], desc: 'array' },
    ])('rejects params: $desc', ({ value }) => {
      const payload = { ...base, params: value };
      const result = actionTokenPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
      expect(result.error?.issues.some(i => i.path[0] === 'params')).toBe(true);
    });
  });

  describe('error details', () => {
    it('returns precise error messages and paths', () => {
      const payload = { visitorId: '', action: 'bad', exp: 0 };
      const result = actionTokenPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
      const issues = result.error?.issues;
      expect(issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ path: ['visitorId'] }),
          expect.objectContaining({ path: ['action'] }),
          expect.objectContaining({ path: ['exp'] }),
        ])
      );
    });
  });
});

describe('validateActionTokenPayload', () => {
  it('returns success for valid input', () => {
    const input: MinimalPayload = {
      visitorId: 'id',
      action: ACTION_TOKEN_ACTIONS[1],
      exp: 123456,
    };
    const result = validateActionTokenPayload(input);
    expect(result.success).toBe(true);
    if (!result.success) throw new Error('Should be success');
    expect(result.data).toMatchObject(input);
  });

  it('returns failure for invalid input', () => {
    const input = { foo: 'bar' };
    const result = validateActionTokenPayload(input);
    expect(result.success).toBe(false);
    expect(result.error?.issues.length).toBeGreaterThan(0);
  });

  it('returns failure for completely empty input', () => {
    const result = validateActionTokenPayload(undefined);
    expect(result.success).toBe(false);
    expect(result.error?.issues.length).toBeGreaterThan(0);
  });
}); 