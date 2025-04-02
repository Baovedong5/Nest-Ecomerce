import { createZodDto } from 'nestjs-zod';
import {
  CreateBrandTranslationSchema,
  GetBrandTranslationDetailResSchema,
  GetBrandTranslationParamsSchema,
  UpdateBrandTranslationSchema,
} from './brand-translation.model';

export class GetBrandTranslationParamsDTO extends createZodDto(GetBrandTranslationParamsSchema) {}

export class GetBrandTranslationDetailResDTO extends createZodDto(GetBrandTranslationDetailResSchema) {}

export class CreateBrandTranslationDTO extends createZodDto(CreateBrandTranslationSchema) {}

export class UpdateBrandTranslationDTO extends createZodDto(UpdateBrandTranslationSchema) {}
