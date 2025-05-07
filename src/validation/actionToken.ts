import { z } from 'zod';
import { ActionTokenAction } from '@/types/actionToken';

export const actionTokenPayloadSchema = z.object({
  visitorId: z.string().min(1, 'visitorId requis'),
  action: z.enum([
    'create',
    'read',
    'update',
    'delete',
    'submit',
    'confirm',
    'choose',
    'access',
    'download',
  ] as [ActionTokenAction, ...ActionTokenAction[]]),
  params: z.record(z.any()).optional(),
  exp: z.number().int().min(1, 'exp requis'),
});

export type ActionTokenPayloadInput = z.infer<typeof actionTokenPayloadSchema>;

export function validateActionTokenPayload(input: unknown) {
  return actionTokenPayloadSchema.safeParse(input);
} 