import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { IsPublic } from 'src/shared/decorators/auth.decorator';
import { ZodResponse, ZodSerializerDto } from 'nestjs-zod';
import {
  CreateCategoryBodyDTO,
  GetAllCategoriesQueryDTO,
  GetAllCategoriesResDTO,
  GetCategoryDetailResDTO,
  GetCategoryParamsDTO,
  UpdateCategoryBodyDTO,
} from './category.dto';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { MessageResDTO } from 'src/shared/dtos/response.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @IsPublic()
  @ZodResponse({ type: GetAllCategoriesResDTO })
  findAll(@Query() query: GetAllCategoriesQueryDTO) {
    return this.categoryService.findAll(query.parentCategoryId);
  }

  @Get(':categoryId')
  @IsPublic()
  @ZodResponse({ type: GetCategoryDetailResDTO })
  findById(@Param() params: GetCategoryParamsDTO) {
    return this.categoryService.findById(params.categoryId);
  }

  @Post()
  @ZodResponse({ type: GetCategoryDetailResDTO })
  create(@Body() body: CreateCategoryBodyDTO, @ActiveUser('userId') userId: number) {
    return this.categoryService.create({ createdById: userId, data: body });
  }

  @Put(':categoryId')
  @ZodResponse({ type: GetCategoryDetailResDTO })
  update(
    @Param() params: GetCategoryParamsDTO,
    @Body() body: UpdateCategoryBodyDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.categoryService.update({
      id: params.categoryId,
      updatedById: userId,
      data: body,
    });
  }

  @Delete(':categoryId')
  @ZodResponse({ type: MessageResDTO })
  delete(@Param() params: GetCategoryParamsDTO, @ActiveUser('userId') userId: number) {
    return this.categoryService.delete({
      id: params.categoryId,
      deletedById: userId,
    });
  }
}
