import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { LanguagesService } from './language.service';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  CreateLanguageBodyDTO,
  GetLanguageDetailResDTO,
  GetLanguageParamsDTO,
  GetLanguageResDTO,
  UpdateLanguageBodyDTO,
} from './language.dto';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { MessageResDTO } from 'src/shared/dtos/response.dto';

@Controller('languages')
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) {}

  @Get()
  @ZodSerializerDto(GetLanguageResDTO)
  findAll() {
    return this.languagesService.findAll();
  }

  @Get(':languageId')
  @ZodSerializerDto(GetLanguageDetailResDTO)
  findById(@Param() params: GetLanguageParamsDTO) {
    return this.languagesService.findById(params.languageId);
  }

  @Post()
  @ZodSerializerDto(GetLanguageDetailResDTO)
  createLanguage(@Body() data: CreateLanguageBodyDTO, @ActiveUser('userId') userId: number) {
    return this.languagesService.createLanguage({
      data,
      createdById: userId,
    });
  }

  @Put(':languageId')
  @ZodSerializerDto(GetLanguageDetailResDTO)
  updateLanguage(
    @Body() body: UpdateLanguageBodyDTO,
    @Param() params: GetLanguageParamsDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.languagesService.updateLanguage({
      data: body,
      id: params.languageId,
      updatedById: userId,
    });
  }

  @Delete(':languageId')
  @ZodSerializerDto(MessageResDTO)
  deleteLanguage(@Param() params: GetLanguageParamsDTO) {
    return this.languagesService.deleteLanguage(params.languageId);
  }
}
