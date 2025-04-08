import { createZodDto } from 'nestjs-zod';
import { GetProductDetailResSchema } from '../product.model';
import {
  CreateProductTranslationBodySchema,
  GetProductTranslationParamsSchema,
  UpdateProductTranslationBodySchema,
} from './product-translation.model';

export class GetProductTranslationDetailResDTO extends createZodDto(GetProductDetailResSchema) {}

export class GetProductTranslationParamsDTO extends createZodDto(GetProductTranslationParamsSchema) {}

export class CreateProductTranslationBodyDTO extends createZodDto(CreateProductTranslationBodySchema) {}

export class UpdateProductTranslationBodyDTO extends createZodDto(UpdateProductTranslationBodySchema) {}
