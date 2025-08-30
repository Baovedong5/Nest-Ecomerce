import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { BrandService } from './brand.service';
import { IsPublic } from 'src/shared/decorators/auth.decorator';
import { ZodResponse, ZodSerializerDto } from 'nestjs-zod';
import {
  CreateBrandBodyDTO,
  GetBrandDetailResDTO,
  GetBrandParamsDTO,
  GetBrandResDTO,
  UpdateBrandBodyDTO,
} from './brand.dto';
import { PaginationQueryDTO } from 'src/shared/dtos/request.dto';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { MessageResDTO } from 'src/shared/dtos/response.dto';

@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get()
  @IsPublic()
  @ZodResponse({ type: GetBrandResDTO })
  list(@Query() query: PaginationQueryDTO) {
    return this.brandService.list(query);
  }

  @Get(':brandId')
  @IsPublic()
  @ZodResponse({ type: GetBrandDetailResDTO })
  findById(@Param() params: GetBrandParamsDTO) {
    return this.brandService.findById(params.brandId);
  }

  @Post()
  @ZodResponse({ type: GetBrandDetailResDTO })
  create(@Body() body: CreateBrandBodyDTO, @ActiveUser('userId') userId: number) {
    return this.brandService.create({
      createdById: userId,
      data: body,
    });
  }

  @Put(':brandId')
  @ZodResponse({ type: GetBrandDetailResDTO })
  update(@Param() params: GetBrandParamsDTO, @Body() body: UpdateBrandBodyDTO, @ActiveUser('userId') userId: number) {
    return this.brandService.update({
      id: params.brandId,
      updatedById: userId,
      data: body,
    });
  }

  @Delete(':brandId')
  @ZodResponse({ type: MessageResDTO })
  delete(@Param() params: GetBrandParamsDTO, @ActiveUser('userId') userId: number) {
    return this.brandService.delete({
      id: params.brandId,
      deletedById: userId,
    });
  }
}
