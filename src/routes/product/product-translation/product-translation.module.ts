import { Module } from '@nestjs/common';
import { ProductTranslationController } from './product-translation.controller';
import { ProductTranslationRepository } from './product-translation.repo';
import { ProductTranslationService } from './product-translation.service';

@Module({
  controllers: [ProductTranslationController],
  providers: [ProductTranslationRepository, ProductTranslationService],
})
export class ProductTranslationModule {}
