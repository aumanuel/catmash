import { SignJWT, jwtVerify, JWTPayload } from 'jose';
import { ActionTokenPayload, ActionTokenOptions } from '../types/actionToken';
import { actionTokenPayloadSchema } from '../validation/actionToken';
import { ACTION_TOKEN_SECRET, ACTION_TOKEN_DEFAULT_EXPIRES_IN } from '../config/actionToken';

const encoder = new TextEncoder();

export async function signActionToken(options: ActionTokenOptions): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + (options.expiresInSeconds || ACTION_TOKEN_DEFAULT_EXPIRES_IN);
  const payload: ActionTokenPayload = {
    visitorId: options.visitorId,
    action: options.action,
    params: options.params,
    exp,
  };
  const parsed = actionTokenPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error('Payload d\'action token invalide: ' + JSON.stringify(parsed.error.format()));
  }
  return await new SignJWT(payload as unknown as JWTPayload)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setExpirationTime(exp)
    .sign(encoder.encode(ACTION_TOKEN_SECRET));
}

export async function verifyActionToken(token: string): Promise<ActionTokenPayload> {
  try {
    const { payload } = await jwtVerify(token, encoder.encode(ACTION_TOKEN_SECRET), {
      algorithms: ['HS256'],
    });
    const parsed = actionTokenPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      throw new Error('Payload d\'action token invalide: ' + JSON.stringify(parsed.error.format()));
    }
    return parsed.data;
  } catch (err) {
    throw new Error('Action token invalide ou expiré');
  }
} 