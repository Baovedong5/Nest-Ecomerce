import { BrandTranslationSchema } from 'src/shared/models/shared-brand-translation.model';
import { z } from 'zod';

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
