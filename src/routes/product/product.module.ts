import { Module } from '@nestjs/common';
import { ProductRepository } from './product.repo';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';

@Module({
  providers: [ProductRepository, ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
