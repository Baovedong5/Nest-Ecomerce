import { Injectable } from '@nestjs/common';
import { BrandRepository } from './brand.repo';
import { PaginationQueryType } from 'src/shared/models/request.model';
import { NotFoundRecordException } from 'src/shared/error';
import { CreateBrandBodyType, UpdateBrandBodyType } from './brand.model';
import { isNotFoundPrismaError } from 'src/shared/helper';

@Injectable()
export class BrandService {
  constructor(private readonly brandRepository: BrandRepository) {}

  async list(pagination: PaginationQueryType) {
    const data = await this.brandRepository.list(pagination);

    return data;
  }

  async findById(id: number) {
    const brand = await this.brandRepository.findById(id);

    if (!brand) {
      throw NotFoundRecordException;
    }

    return brand;
  }

  async create({ createdById, data }: { createdById: number; data: CreateBrandBodyType }) {
    return await this.brandRepository.create({ createdById, data });
  }

  async update({ id, updatedById, data }: { id: number; updatedById: number; data: UpdateBrandBodyType }) {
    try {
      const brand = await this.brandRepository.update({ id, updatedById, data });

      return brand;
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException;
      }

      throw error;
    }
  }

  async delete({ id, deletedById }: { id: number; deletedById: number }) {
    try {
      await this.brandRepository.delete({
        id,
        deletedById,
      });

      return {
        message: 'Delete successfully',
      };
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException;
      }
      throw error;
    }
  }
}
