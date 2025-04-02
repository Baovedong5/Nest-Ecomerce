import { Module } from '@nestjs/common';
import { BrandRepository } from './brand.repo';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';

@Module({
  controllers: [BrandController],
  providers: [BrandRepository, BrandService],
})
export class BrandModule {}
