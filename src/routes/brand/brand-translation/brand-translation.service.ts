import { Injectable } from '@nestjs/common';
import { BrandTranslationRepository } from './brand-translation.repo';
import { NotFoundRecordException } from 'src/shared/error';
import { CreateBrandTranslationType, UpdateBrandTranslationType } from './brand-translation.model';
import { isNotFoundPrismaError, isUniqueConstraintPrismaError } from 'src/shared/helper';
import { BrandTranslationAlreadyExistsException } from './brand-translation.error';

@Injectable()
export class BrandTranslationService {
  constructor(private readonly brandTranslationRepo: BrandTranslationRepository) {}

  async findById(id: number) {
    const brand = await this.brandTranslationRepo.findById(id);

    if (!brand) {
      throw NotFoundRecordException;
    }

    return brand;
  }

  async create({ createdById, data }: { createdById: number; data: CreateBrandTranslationType }) {
    try {
      return await this.brandTranslationRepo.create({ createdById, data });
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw BrandTranslationAlreadyExistsException;
      }

      throw error;
    }
  }

  async update({ id, updatedById, data }: { id: number; updatedById: number; data: UpdateBrandTranslationType }) {
    try {
      const brand = await this.brandTranslationRepo.update({ id, updatedById, data });

      return brand;
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw BrandTranslationAlreadyExistsException;
      }
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException;
      }

      throw error;
    }
  }

  async delete({ id, deletedById }: { id: number; deletedById: number }) {
    try {
      await this.brandTranslationRepo.delete({ id, deletedById });

      return {
        message: 'delete success',
      };
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException;
      }
      throw error;
    }
  }
}
