import { Module } from '@nestjs/common';
import { BrandTranslationController } from './brand-translation.controller';
import { BrandTranslationRepository } from './brand-translation.repo';
import { BrandTranslationService } from './brand-translation.service';

@Module({
  controllers: [BrandTranslationController],
  providers: [BrandTranslationRepository, BrandTranslationService],
})
export class BrandTranslationModule {}
