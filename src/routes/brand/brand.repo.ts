import { Injectable } from '@nestjs/common';
import { PaginationQueryType } from 'src/shared/models/request.model';
import { PrismaService } from 'src/shared/services/prisma.service';
import {
  BrandIncludeTranslationType,
  BrandType,
  CreateBrandBodyType,
  GetBrandDetailResType,
  GetBrandResType,
  UpdateBrandBodyType,
} from './brand.model';
import { ALL_LANGUAGES_CODE } from 'src/shared/constants/other.constant';

@Injectable()
export class BrandRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async list(pagination: PaginationQueryType, languageId: string): Promise<GetBrandResType> {
    const skip = (pagination.page - 1) * pagination.limit;
    const take = pagination.limit;
    const [totalItems, data] = await Promise.all([
      this.prismaService.brand.count({
        where: {
          deletedAt: null,
        },
      }),
      this.prismaService.brand.findMany({
        where: {
          deletedAt: null,
        },
        include: {
          brandTranslations: {
            where: languageId === ALL_LANGUAGES_CODE ? { deletedAt: null } : { languageId, deletedAt: null },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take,
      }),
    ]);

    return {
      totalItems,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(totalItems / pagination.limit),
      data,
    };
  }

  findById(id: number, languageId: string): Promise<GetBrandDetailResType | null> {
    return this.prismaService.brand.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        brandTranslations: {
          where: languageId === ALL_LANGUAGES_CODE ? { deletedAt: null } : { languageId, deletedAt: null },
        },
      },
    });
  }

  create({
    createdById,
    data,
  }: {
    createdById: number | null;
    data: CreateBrandBodyType;
  }): Promise<BrandIncludeTranslationType> {
    return this.prismaService.brand.create({
      data: {
        ...data,
        createdById,
      },
      include: {
        brandTranslations: {
          where: {
            deletedAt: null,
          },
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
    data: UpdateBrandBodyType;
  }): Promise<BrandIncludeTranslationType> {
    return this.prismaService.brand.update({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        ...data,
        updatedById,
      },
      include: {
        brandTranslations: {
          where: {
            deletedAt: null,
          },
        },
      },
    });
  }

  delete({ id, deletedById }: { id: number; deletedById: number }, isHard?: boolean): Promise<BrandType> {
    return isHard
      ? this.prismaService.brand.delete({
          where: {
            id,
          },
        })
      : this.prismaService.brand.update({
          where: {
            id,
            deletedAt: null,
          },
          data: {
            deletedById,
            deletedAt: new Date(),
          },
        });
  }
}
