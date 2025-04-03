import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import {
  CategoryInCluedeTranslationType,
  CategoryType,
  CreateCategoryBodyType,
  GetAllCategoriesResType,
  UpdateCategoryBodyType,
} from './category.model';
import { ALL_LANGUAGES_CODE } from 'src/shared/constants/other.constant';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll({
    parentCategoryId,
    languageId,
  }: {
    parentCategoryId?: number | null;
    languageId: string;
  }): Promise<GetAllCategoriesResType> {
    const categories = await this.prismaService.category.findMany({
      where: {
        deletedAt: null,
        parentCategoryId: parentCategoryId ?? null,
      },
      include: {
        categoryTranslations: {
          where: languageId === ALL_LANGUAGES_CODE ? { deletedAt: null } : { deletedAt: null, languageId },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      data: categories,
      totalItems: categories.length,
    };
  }

  findById({ id, languageId }: { id: number; languageId: string }): Promise<CategoryInCluedeTranslationType | null> {
    return this.prismaService.category.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        categoryTranslations: {
          where: languageId === ALL_LANGUAGES_CODE ? { deletedAt: null } : { deletedAt: null, languageId },
        },
      },
    });
  }

  create({
    createdById,
    data,
  }: {
    createdById: number | null;
    data: CreateCategoryBodyType;
  }): Promise<CategoryInCluedeTranslationType> {
    return this.prismaService.category.create({
      data: {
        ...data,
        createdById,
      },
      include: {
        categoryTranslations: {
          where: { deletedAt: null },
        },
      },
    });
  }

  update({
    id,
    updatedById,
    data,
  }: {
    id: number;
    updatedById: number;
    data: UpdateCategoryBodyType;
  }): Promise<CategoryInCluedeTranslationType> {
    return this.prismaService.category.update({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        ...data,
        updatedById,
      },
      include: {
        categoryTranslations: {
          where: { deletedAt: null },
        },
      },
    });
  }

  delete(
    {
      id,
      deletedById,
    }: {
      id: number;
      deletedById: number;
    },
    isHard?: boolean,
  ): Promise<CategoryType> {
    return isHard
      ? this.prismaService.category.delete({
          where: {
            id,
          },
        })
      : this.prismaService.category.update({
          where: {
            id,
            deletedAt: null,
          },
          data: {
            deletedAt: new Date(),
            deletedById,
          },
        });
  }
}
