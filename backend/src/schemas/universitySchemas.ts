import { z } from 'zod'

export const universityIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
})

export const listUniversitiesQuerySchema = z.object({
  includeInactive: z
    .enum(['true', 'false'])
    .optional()
    .transform((v) => v === 'true'),
})

export const createUniversitySchema = z.object({
  name: z.string().trim().min(1, 'name is required'),
  country: z.string().trim().min(1).optional(),
})

export const updateUniversitySchema = z
  .object({
    name: z.string().trim().min(1, 'name cannot be empty'),
    country: z.string().trim().min(1).nullable(),
  })
  .partial()

export type UniversityIdParam = z.infer<typeof universityIdParamSchema>
export type ListUniversitiesQuery = z.infer<typeof listUniversitiesQuerySchema>
export type CreateUniversityBody = z.infer<typeof createUniversitySchema>
export type UpdateUniversityBody = z.infer<typeof updateUniversitySchema>
