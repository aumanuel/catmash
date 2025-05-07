import { z } from 'zod';

/**
 * Schéma principal pour un objet Cat.
 */
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

/**
 * Schéma pour la création d'un Cat (id, score et match sont généralement générés côté serveur).
 */
export const catCreateSchema = catSchema.omit({
  id: true,
  score: true,
  match: true,
});

/**
 * Schéma pour la mise à jour d'un Cat (tous les champs optionnels sauf id).
 */
export const catUpdateSchema = catSchema.partial().extend({
  id: z.string({
    required_error: 'L\'identifiant est requis pour la mise à jour.'
  }),
});

/**
 * Schéma pour un tableau de chats.
 */
export const catsArraySchema = z.array(catSchema);

// Types TypeScript dérivés des schémas Zod
export type CatInput = z.infer<typeof catSchema>;
export type CatCreateInput = z.infer<typeof catCreateSchema>;
export type CatUpdateInput = z.infer<typeof catUpdateSchema>; 