import { Injectable } from '@nestjs/common';
import { ProductRepository } from './product.repo';
import { CreateProductBodyType, GetProductsQueryType, UpdateProductBodyType } from './product.model';
import { I18nContext } from 'nestjs-i18n';
import { NotFoundRecordException } from 'src/shared/error';
import { isNotFoundPrismaError } from 'src/shared/helper';

@Injectable()
export class ProductService {
  constructor(private readonly productRepo: ProductRepository) {}

  async list(query: GetProductsQueryType) {
    const data = await this.productRepo.list(query, I18nContext.current()?.lang as string);
    return data;
  }

  async findById(id: number) {
    const product = await this.productRepo.findById(id, I18nContext.current()?.lang as string);

    if (!product) {
      throw NotFoundRecordException;
    }

    return product;
  }

  async create({ createdById, data }: { createdById: number; data: CreateProductBodyType }) {
    return await this.productRepo.create({
      createdById,
      data,
    });
  }

  async update({ id, updatedById, data }: { id: number; updatedById: number; data: UpdateProductBodyType }) {
    try {
      const product = await this.productRepo.update({ id, updatedById, data });

      return product;
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException;
      }

      throw error;
    }
  }

  async delete({ id, deletedById }: { id: number; deletedById: number }) {
    try {
      await this.productRepo.delete({ id, deletedById });

      return {
        message: 'Product deleted successfully',
      };
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException;
      }

      throw error;
    }
  }
}
