import { Injectable } from '@nestjs/common';
import { CreateLanguageBodyType, UpdateLanguageBodyType } from './language.model';
import { LanguageRepository } from './language.repo';
import { NotFoundRecordException } from 'src/shared/error';
import { isNotFoundPrismaError, isUniqueConstraintPrismaError } from 'src/shared/helper';
import { LanguageAlreadyExistsException } from './language.error';

@Injectable()
export class LanguagesService {
  constructor(private readonly languageRepo: LanguageRepository) {}

  async findAll() {
    const data = await this.languageRepo.findAll();
    return {
      data,
      totalItems: data.length,
    };
  }

  async findById(id: string) {
    const language = await this.languageRepo.findById(id);

    if (!language) {
      throw NotFoundRecordException;
    }

    return language;
  }

  async createLanguage({ data, createdById }: { data: CreateLanguageBodyType; createdById: number }) {
    try {
      return await this.languageRepo.createLanguage({ createdById, data });
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw LanguageAlreadyExistsException;
      }

      throw error;
    }
  }

  async updateLanguage({ id, data, updatedById }: { id: string; data: UpdateLanguageBodyType; updatedById: number }) {
    try {
      const language = await this.languageRepo.updateLanguage({ id, updatedById, data });

      return language;
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException;
      }

      throw error;
    }
  }

  async deleteLanguage(id: string) {
    try {
      await this.languageRepo.deleteLanguage(id, true);

      return {
        message: 'Xóa ngôn ngữ thành công',
      };
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException;
      }

      throw error;
    }
  }
}
