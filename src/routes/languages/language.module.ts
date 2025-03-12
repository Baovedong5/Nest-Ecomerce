import { Module } from '@nestjs/common';
import { LanguagesController } from './language.controller';
import { LanguagesService } from './language.service';
import { LanguageRepository } from './language.repo';

@Module({
  controllers: [LanguagesController],
  providers: [LanguagesService, LanguageRepository],
})
export class LanguagesModule {}
