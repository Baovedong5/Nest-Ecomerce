import { Injectable } from '@nestjs/common';
import { ProductTranslationRepository } from './product-translation.repo';
import { NotFoundRecordException } from 'src/shared/error';
import { CreateProductTranslationBodyType, UpdateProductTranslationBodyType } from './product-translation.model';
import { isNotFoundPrismaError, isUniqueConstraintPrismaError } from 'src/shared/helper';
import { ProductTranslationAlreadyExistsException } from './product-translation.error';

@Injectable()
export class ProductTranslationService {
  constructor(private readonly productTranslationRepo: ProductTranslationRepository) {}

  async findById(id: number) {
    const product = await this.productTranslationRepo.findById(id);

    if (!product) {
      throw NotFoundRecordException;
    }

    return product;
  }

  async create({ createdById, data }: { createdById: number; data: CreateProductTranslationBodyType }) {
    try {
      return await this.productTranslationRepo.create({
        createdById,
        data,
      });
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw ProductTranslationAlreadyExistsException;
      }

      throw error;
    }
  }

  async update({ id, updatedById, data }: { id: number; updatedById: number; data: UpdateProductTranslationBodyType }) {
    try {
      const product = await this.productTranslationRepo.update({ id, updatedById, data });

      return product;
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw ProductTranslationAlreadyExistsException;
      }

      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException;
      }

      throw error;
    }
  }

  async delete({ id, deletedById }: { id: number; deletedById: number }) {
    try {
      await this.productTranslationRepo.delete({ id, deletedById });

      return {
        message: 'Product translation deleted successfully',
      };
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException;
      }

      throw error;
    }
  }
}
