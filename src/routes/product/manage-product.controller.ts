import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  CreateProductBodyDTO,
  GetManagerProductsQueryDTO,
  GetProductDetailResDTO,
  GetProductParamsDTO,
  GetProductsResDTO,
  ProductDTO,
  UpdateProductBodyDTO,
} from './product.dto';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { MessageResDTO } from 'src/shared/dtos/response.dto';
import { AccessTokenPayload } from 'src/shared/types/jwt.type';
import { ManageProductService } from './manage-product.service';

@Controller('manage-product/products')
export class ManageProductController {
  constructor(private readonly manageProductService: ManageProductService) {}

  @Get()
  @ZodSerializerDto(GetProductsResDTO)
  list(@Query() query: GetManagerProductsQueryDTO, @ActiveUser() user: AccessTokenPayload) {
    return this.manageProductService.list({
      query,
      userIdRequest: user.userId,
      roleNameRequest: user.roleName,
    });
  }

  @Get(':productId')
  @ZodSerializerDto(GetProductDetailResDTO)
  findById(@Param() params: GetProductParamsDTO, @ActiveUser() user: AccessTokenPayload) {
    return this.manageProductService.getDetail({
      productId: params.productId,
      userIdRequest: user.userId,
      roleNameRequest: user.roleName,
    });
  }

  @Post()
  @ZodSerializerDto(GetProductDetailResDTO)
  create(@Body() body: CreateProductBodyDTO, @ActiveUser('userId') userId: number) {
    return this.manageProductService.create({
      data: body,
      createdById: userId,
    });
  }

  @Put(':productId')
  @ZodSerializerDto(ProductDTO)
  update(
    @Body() body: UpdateProductBodyDTO,
    @Param() params: GetProductParamsDTO,
    @ActiveUser() user: AccessTokenPayload,
  ) {
    return this.manageProductService.update({
      data: body,
      productId: params.productId,
      updatedById: user.userId,
      roleNameRequest: user.roleName,
    });
  }

  @Delete(':productId')
  @ZodSerializerDto(MessageResDTO)
  delete(@Param() params: GetProductParamsDTO, @ActiveUser() user: AccessTokenPayload) {
    return this.manageProductService.delete({
      productId: params.productId,
      deletedById: user.userId,
      roleNameRequest: user.roleName,
    });
  }
}
