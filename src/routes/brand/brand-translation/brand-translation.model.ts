import { z } from 'zod';

export const BrandTranslationSchema = z.object({
  id: z.number(),
  brandId: z.number(),
  languageId: z.string(),
  name: z.string().max(500),
  description: z.string(),

  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedById: z.number().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GetBrandTranslationParamsSchema = z
  .object({
    brandTranslationId: z.coerce.number().int().positive(),
  })
  .strict();

export const GetBrandTranslationDetailResSchema = BrandTranslationSchema;

export const CreateBrandTranslationSchema = BrandTranslationSchema.pick({
  brandId: true,
  languageId: true,
  name: true,
  description: true,
}).strict();

export const UpdateBrandTranslationSchema = CreateBrandTranslationSchema;

export type BrandTranslationType = z.infer<typeof BrandTranslationSchema>;
export type GetBrandTranslationParamsType = z.infer<typeof GetBrandTranslationParamsSchema>;
export type GetBrandTranslationDetailResType = z.infer<typeof GetBrandTranslationDetailResSchema>;
export type CreateBrandTranslationType = z.infer<typeof CreateBrandTranslationSchema>;
export type UpdateBrandTranslationType = z.infer<typeof UpdateBrandTranslationSchema>;
