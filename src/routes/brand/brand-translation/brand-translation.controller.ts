import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { BrandTranslationService } from './brand-translation.service';
import { ZodResponse, ZodSerializerDto } from 'nestjs-zod';
import {
  CreateBrandTranslationDTO,
  GetBrandTranslationDetailResDTO,
  GetBrandTranslationParamsDTO,
  UpdateBrandTranslationDTO,
} from './brand-translation.dto';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { MessageResDTO } from 'src/shared/dtos/response.dto';

@Controller('brand-translations')
export class BrandTranslationController {
  constructor(private readonly brandTranslationService: BrandTranslationService) {}

  @Get(':brandTranslationId')
  @ZodResponse({ type: GetBrandTranslationDetailResDTO })
  findById(@Param() params: GetBrandTranslationParamsDTO) {
    return this.brandTranslationService.findById(params.brandTranslationId);
  }

  @Post()
  @ZodResponse({ type: GetBrandTranslationDetailResDTO })
  create(@Body() body: CreateBrandTranslationDTO, @ActiveUser('userId') userId: number) {
    return this.brandTranslationService.create({
      createdById: userId,
      data: body,
    });
  }

  @Put(':brandTranslationId')
  @ZodResponse({ type: GetBrandTranslationDetailResDTO })
  update(
    @Param() params: GetBrandTranslationParamsDTO,
    @Body() body: UpdateBrandTranslationDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.brandTranslationService.update({
      id: params.brandTranslationId,
      updatedById: userId,
      data: body,
    });
  }

  @Delete(':brandTranslationId')
  @ZodResponse({ type: MessageResDTO })
  delete(@Param() params: GetBrandTranslationParamsDTO, @ActiveUser('userId') userId: number) {
    return this.brandTranslationService.delete({
      id: params.brandTranslationId,
      deletedById: userId,
    });
  }
}
