import { z } from 'zod';

export const catSchema = z.object({
  id: z.string({
    required_error: 'L\'identifiant est requis.',
    invalid_type_error: 'L\'identifiant doit être une chaîne.'
  }),
  url: z.string({
    required_error: 'L\'URL est requise.',
    invalid_type_error: 'L\'URL doit être une chaîne.'
  }).url('L\'URL doit être valide.'),
  score: z.number({
    required_error: 'Le score est requis.',
    invalid_type_error: 'Le score doit être un nombre.'
  }).int('Le score doit être un entier.').min(0, 'Le score doit être positif ou nul.'),
  name: z.string({
    required_error: 'Le nom est requis.',
    invalid_type_error: 'Le nom doit être une chaîne.'
  }).min(1, 'Le nom ne peut pas être vide.'),
  match: z.number({
    required_error: 'Le nombre de matchs est requis.',
    invalid_type_error: 'Le nombre de matchs doit être un nombre.'
  }).int('Le nombre de matchs doit être un entier.').min(0, 'Le nombre de matchs doit être positif ou nul.'),
});

export const catCreateSchema = catSchema.omit({
  id: true,
  score: true,
  match: true,
});

export const catUpdateSchema = catSchema.partial().extend({
  id: z.string({
    required_error: 'L\'identifiant est requis pour la mise à jour.'
  }),
});

export const catsArraySchema = z.array(catSchema);

export type CatInput = z.infer<typeof catSchema>;
export type CatCreateInput = z.infer<typeof catCreateSchema>;
export type CatUpdateInput = z.infer<typeof catUpdateSchema>; 