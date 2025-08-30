import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import {
  CategoryTranslationType,
  CreateCategoryTranslationBodyType,
  GetCategoryTranslationDetailResType,
  UpdateCategoryTranslationBodyType,
} from './category-translation.model';
import { SerializeAll } from 'src/shared/decorators/serialize.decorator';

@Injectable()
@SerializeAll()
export class CategoryTranslationRepo {
  constructor(private readonly prismaService: PrismaService) {}

  findById(id: number): Promise<GetCategoryTranslationDetailResType | null> {
    return this.prismaService.categoryTranslation.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    }) as any;
  }

  create({
    createdById,
    data,
  }: {
    createdById: number | null;
    data: CreateCategoryTranslationBodyType;
  }): Promise<CategoryTranslationType> {
    return this.prismaService.categoryTranslation.create({
      data: {
        ...data,
        createdById,
      },
    }) as any;
  }

  update({
    id,
    data,
    updatedById,
  }: {
    id: number;
    updatedById: number;
    data: UpdateCategoryTranslationBodyType;
  }): Promise<CategoryTranslationType> {
    return this.prismaService.categoryTranslation.update({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        ...data,
        updatedById,
      },
    }) as any;
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
  ): Promise<CategoryTranslationType> {
    return (
      isHard
        ? this.prismaService.categoryTranslation.delete({
            where: {
              id,
            },
          })
        : this.prismaService.categoryTranslation.update({
            where: {
              id,
              deletedAt: null,
            },
            data: {
              deletedAt: new Date(),
              deletedById,
            },
          })
    ) as any;
  }
}
