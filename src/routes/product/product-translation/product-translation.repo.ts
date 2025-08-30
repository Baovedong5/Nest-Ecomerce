import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import {
  CreateProductTranslationBodyType,
  GetProductTranslationDetailResType,
  ProductTranslationType,
  UpdateProductTranslationBodyType,
} from './product-translation.model';
import { SerializeAll } from 'src/shared/decorators/serialize.decorator';

@Injectable()
@SerializeAll()
export class ProductTranslationRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findById(id: number): Promise<GetProductTranslationDetailResType | null> {
    return this.prismaService.productTranslation.findUnique({
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
    createdById: number;
    data: CreateProductTranslationBodyType;
  }): Promise<ProductTranslationType> {
    return this.prismaService.productTranslation.create({
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
    data: UpdateProductTranslationBodyType;
  }): Promise<ProductTranslationType> {
    return this.prismaService.productTranslation.update({
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

  delete({ deletedById, id }: { deletedById: number; id: number }, isHard?: boolean): Promise<ProductTranslationType> {
    return (
      isHard
        ? this.prismaService.productTranslation.delete({
            where: {
              id,
            },
          })
        : this.prismaService.productTranslation.update({
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
