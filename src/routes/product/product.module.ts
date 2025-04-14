import { Module } from '@nestjs/common';
import { ProductRepository } from './product.repo';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ManageProductService } from './manage-product.service';
import { ManageProductController } from './manage-product.controller';

@Module({
  providers: [ProductRepository, ProductService, ManageProductService],
  controllers: [ProductController, ManageProductController],
})
export class ProductModule {}
