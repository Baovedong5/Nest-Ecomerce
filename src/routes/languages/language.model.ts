import { z } from 'zod';

export const LanguageSchema = z.object({
  id: z.string().max(10),
  name: z.string().max(500),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedAt: z.iso.datetime().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const CreateLanguageBodySchema = LanguageSchema.pick({
  id: true,
  name: true,
}).strict();

export const GetLanguageResSchema = z.object({
  data: z.array(LanguageSchema),
  totalItems: z.number(),
});

export const GetLanguageParamsSchema = z
  .object({
    languageId: z.string().max(10),
  })
  .strict();

export const GetLanguageDetailResSchema = LanguageSchema;

export const UpdateLanguageBodySchema = LanguageSchema.pick({
  name: true,
}).strict();

export type LanguageType = z.infer<typeof LanguageSchema>;
export type CreateLanguageBodyType = z.infer<typeof CreateLanguageBodySchema>;
export type GetLanguageResType = z.infer<typeof GetLanguageResSchema>;
export type GetLanguageParamsType = z.infer<typeof GetLanguageParamsSchema>;
export type GetLanguageDetailResType = z.infer<typeof GetLanguageDetailResSchema>;
export type UpdateLanguageBodyType = z.infer<typeof UpdateLanguageBodySchema>;
