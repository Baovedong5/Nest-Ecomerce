import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { IsPublic } from 'src/shared/decorators/auth.decorator';
import { ZodResponse, ZodSerializerDto } from 'nestjs-zod';
import { GetProductDetailResDTO, GetProductParamsDTO, GetProductsQueryDTO, GetProductsResDTO } from './product.dto';

@Controller('products')
@IsPublic()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ZodResponse({ type: GetProductsResDTO })
  list(@Query() query: GetProductsQueryDTO) {
    return this.productService.list({
      query,
    });
  }

  @Get(':productId')
  @ZodResponse({ type: GetProductDetailResDTO })
  findById(@Param() params: GetProductParamsDTO) {
    return this.productService.getDetail({
      productId: params.productId,
    });
  }
}
