import { createZodDto } from 'nestjs-zod';
import {
  CreateProductBodySchema,
  GetManagerProductsQuerySchema,
  GetProductDetailResSchema,
  GetProductParamsSchema,
  GetProductsQuerySchema,
  GetProductsResSchema,
  UpdateProductBodySchema,
} from './product.model';
import { ProductSchema } from 'src/shared/models/shared-product.model';

export class ProductDTO extends createZodDto(ProductSchema) {}

export class GetProductsResDTO extends createZodDto(GetProductsResSchema) {}

export class GetProductsQueryDTO extends createZodDto(GetProductsQuerySchema) {}

export class GetManagerProductsQueryDTO extends createZodDto(GetManagerProductsQuerySchema) {}

export class GetProductParamsDTO extends createZodDto(GetProductParamsSchema) {}

export class GetProductDetailResDTO extends createZodDto(GetProductDetailResSchema) {}

export class CreateProductBodyDTO extends createZodDto(CreateProductBodySchema) {}

export class UpdateProductBodyDTO extends createZodDto(UpdateProductBodySchema) {}
