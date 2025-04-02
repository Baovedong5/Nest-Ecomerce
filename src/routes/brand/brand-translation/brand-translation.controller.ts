import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { BrandTranslationService } from './brand-translation.service';
import { ZodSerializerDto } from 'nestjs-zod';
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
  @ZodSerializerDto(GetBrandTranslationDetailResDTO)
  findById(@Param() params: GetBrandTranslationParamsDTO) {
    return this.brandTranslationService.findById(params.brandTranslationId);
  }

  @Post()
  @ZodSerializerDto(GetBrandTranslationDetailResDTO)
  create(@Body() body: CreateBrandTranslationDTO, @ActiveUser('userId') userId: number) {
    return this.brandTranslationService.create({
      createdById: userId,
      data: body,
    });
  }

  @Put(':brandTranslationId')
  @ZodSerializerDto(GetBrandTranslationDetailResDTO)
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
  @ZodSerializerDto(MessageResDTO)
  delete(@Param() params: GetBrandTranslationParamsDTO, @ActiveUser('userId') userId: number) {
    return this.brandTranslationService.delete({
      id: params.brandTranslationId,
      deletedById: userId,
    });
  }
}
