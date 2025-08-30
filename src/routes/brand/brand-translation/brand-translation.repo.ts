import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import {
  BrandTranslationType,
  CreateBrandTranslationType,
  GetBrandTranslationDetailResType,
  UpdateBrandTranslationType,
} from './brand-translation.model';
import { SerializeAll } from 'src/shared/decorators/serialize.decorator';

@Injectable()
@SerializeAll()
export class BrandTranslationRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findById(id: number): Promise<GetBrandTranslationDetailResType | null> {
    return this.prismaService.brandTranslation.findUnique({
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
    data: CreateBrandTranslationType;
  }): Promise<BrandTranslationType> {
    return this.prismaService.brandTranslation.create({
      data: {
        ...data,
        createdById,
      },
    }) as any;
  }

  update({
    id,
    updatedById,
    data,
  }: {
    id: number;
    updatedById: number;
    data: UpdateBrandTranslationType;
  }): Promise<BrandTranslationType> {
    return this.prismaService.brandTranslation.update({
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

  delete({ id, deletedById }: { id: number; deletedById: number }, isHard?: boolean): Promise<BrandTranslationType> {
    return (
      isHard
        ? this.prismaService.brandTranslation.delete({
            where: {
              id,
            },
          })
        : this.prismaService.brandTranslation.update({
            where: {
              id,
              deletedAt: null,
            },
            data: {
              deletedById,
              deletedAt: new Date(),
            },
          })
    ) as any;
  }
}
