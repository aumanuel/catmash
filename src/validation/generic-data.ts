import { z } from 'zod';
import { GenericDataStatus } from '../types/generic-data';

const statusEnum = z.nativeEnum(GenericDataStatus);

export const createGenericDataSchema = z.object({
  title: z.string({ required_error: 'Le titre est requis' }).min(1, 'Le titre est requis'),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: statusEnum.optional(),
});

export const updateGenericDataSchema = z.object({
  title: z.string({ required_error: 'Le titre est requis' }).min(1, 'Le titre est requis').optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: statusEnum.optional(),
});

export const genericDataListOptionsSchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  status: statusEnum.optional(),
  search: z.string().optional(),
});

export type CreateGenericDataInput = z.infer<typeof createGenericDataSchema>;
export type UpdateGenericDataInput = z.infer<typeof updateGenericDataSchema>;
export type GenericDataListOptionsInput = z.infer<typeof genericDataListOptionsSchema>;

export function validateCreateGenericData(input: unknown) {
  return createGenericDataSchema.safeParse(input);
}

export function validateUpdateGenericData(input: unknown) {
  return updateGenericDataSchema.safeParse(input);
}

export function validateGenericDataListOptions(input: unknown) {
  return genericDataListOptionsSchema.safeParse(input);
} 