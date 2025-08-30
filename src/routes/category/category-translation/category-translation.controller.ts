import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CategoryTranslationService } from './category-translation.service';
import { ZodResponse, ZodSerializerDto } from 'nestjs-zod';
import {
  CreateCategoryTranslationBodyDTO,
  GetCategoryTranslationDetailResDTO,
  GetCategoryTranslationParamDTO,
  UpdateCategoryTranslationBodyDTO,
} from './category-translation.dto';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { MessageResDTO } from 'src/shared/dtos/response.dto';

@Controller('category-translations')
export class CategoryTranslationController {
  constructor(private readonly categoryTranslationService: CategoryTranslationService) {}

  @Get(':categoryTranslationId')
  @ZodResponse({ type: GetCategoryTranslationDetailResDTO })
  findById(@Param() params: GetCategoryTranslationParamDTO) {
    return this.categoryTranslationService.findById(params.categoryTranslationId);
  }

  @Post()
  @ZodResponse({ type: GetCategoryTranslationDetailResDTO })
  create(@Body() body: CreateCategoryTranslationBodyDTO, @ActiveUser('userId') userId: number) {
    return this.categoryTranslationService.create({
      data: body,
      createdById: userId,
    });
  }

  @Put(':categoryTranslationId')
  @ZodResponse({ type: GetCategoryTranslationDetailResDTO })
  update(
    @Body() body: UpdateCategoryTranslationBodyDTO,
    @Param() params: GetCategoryTranslationParamDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.categoryTranslationService.update({
      data: body,
      id: params.categoryTranslationId,
      updatedById: userId,
    });
  }

  @Delete(':categoryTranslationId')
  @ZodResponse({ type: MessageResDTO })
  delete(@Param() params: GetCategoryTranslationParamDTO, @ActiveUser('userId') userId: number) {
    return this.categoryTranslationService.delete({
      id: params.categoryTranslationId,
      deletedById: userId,
    });
  }
}
