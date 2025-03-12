import { createZodDto } from 'nestjs-zod';
import {
  CreateLanguageBodySchema,
  GetLanguageDetailResSchema,
  GetLanguageParamsSchema,
  GetLanguageResSchema,
  UpdateLanguageBodySchema,
} from './language.model';

export class CreateLanguageBodyDTO extends createZodDto(CreateLanguageBodySchema) {}

export class GetLanguageResDTO extends createZodDto(GetLanguageResSchema) {}

export class GetLanguageParamsDTO extends createZodDto(GetLanguageParamsSchema) {}

export class UpdateLanguageBodyDTO extends createZodDto(UpdateLanguageBodySchema) {}

export class GetLanguageDetailResDTO extends createZodDto(GetLanguageDetailResSchema) {}
