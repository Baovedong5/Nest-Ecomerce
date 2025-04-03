import { Injectable } from '@nestjs/common';
import { CategoryRepository } from './category.repo';
import { I18nContext } from 'nestjs-i18n';
import { NotFoundRecordException } from 'src/shared/error';
import { CreateCategoryBodyType, UpdateCategoryBodyType } from './category.model';
import { isNotFoundPrismaError } from 'src/shared/helper';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  findAll(parentCategoryId?: number | null) {
    return this.categoryRepository.findAll({ parentCategoryId, languageId: I18nContext.current()?.lang as string });
  }

  async findById(id: number) {
    const category = await this.categoryRepository.findById({
      id,
      languageId: I18nContext.current()?.lang as string,
    });

    if (!category) {
      throw NotFoundRecordException;
    }

    return category;
  }

  async create({ createdById, data }: { createdById: number; data: CreateCategoryBodyType }) {
    return await this.categoryRepository.create({
      createdById,
      data,
    });
  }

  async update({ id, updatedById, data }: { id: number; updatedById: number; data: UpdateCategoryBodyType }) {
    try {
      const category = await this.categoryRepository.update({
        id,
        updatedById,
        data,
      });

      return category;
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException;
      }

      throw error;
    }
  }

  async delete({ id, deletedById }: { id: number; deletedById: number }) {
    try {
      await this.categoryRepository.delete({
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
