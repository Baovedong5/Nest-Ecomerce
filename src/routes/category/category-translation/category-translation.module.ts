import { Module } from '@nestjs/common';
import { CategoryTranslationRepo } from './category-translation.repo';
import { CategoryTranslationService } from './category-translation.service';
import { CategoryTranslationController } from './category-translation.controller';

@Module({
  controllers: [CategoryTranslationController],
  providers: [CategoryTranslationRepo, CategoryTranslationService],
})
export class CategoryTranslationModule {}
