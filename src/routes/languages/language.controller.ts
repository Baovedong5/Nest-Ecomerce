import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { LanguagesService } from './language.service';
import { ZodResponse, ZodSerializerDto } from 'nestjs-zod';
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
  @ZodResponse({ type: GetLanguageResDTO })
  findAll() {
    return this.languagesService.findAll();
  }

  @Get(':languageId')
  @ZodResponse({ type: GetLanguageDetailResDTO })
  findById(@Param() params: GetLanguageParamsDTO) {
    return this.languagesService.findById(params.languageId);
  }

  @Post()
  @ZodResponse({ type: GetLanguageDetailResDTO })
  createLanguage(@Body() data: CreateLanguageBodyDTO, @ActiveUser('userId') userId: number) {
    return this.languagesService.createLanguage({
      data,
      createdById: userId,
    });
  }

  @Put(':languageId')
  @ZodResponse({ type: GetLanguageDetailResDTO })
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
  @ZodResponse({ type: MessageResDTO })
  deleteLanguage(@Param() params: GetLanguageParamsDTO) {
    return this.languagesService.deleteLanguage(params.languageId);
  }
}
