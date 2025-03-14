import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import {
  CreatePermissionBodyType,
  GetPermissionQueryType,
  GetPermissionResType,
  PermissionType,
  UpdatePermissionBodyType,
} from './permission.model';

@Injectable()
export class PermissionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async list(pagination: GetPermissionQueryType): Promise<GetPermissionResType> {
    const skip = (pagination.page - 1) * pagination.limit;
    const take = pagination.limit;
    const [totalItems, data] = await Promise.all([
      this.prismaService.permission.count({
        where: {
          deletedAt: null,
        },
      }),
      this.prismaService.permission.findMany({
        where: {
          deletedAt: null,
        },
        take,
        skip,
      }),
    ]);

    return {
      data,
      totalItems,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(totalItems / pagination.limit),
    };
  }

  findById(id: number): Promise<PermissionType | null> {
    return this.prismaService.permission.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  create({
    createdById,
    data,
  }: {
    createdById: number;
    data: CreatePermissionBodyType;
  }): Promise<PermissionType | null> {
    return this.prismaService.permission.create({
      data: {
        ...data,
        createdById,
      },
    });
  }

  update({
    permissionId,
    updatedById,
    data,
  }: {
    permissionId: number;
    updatedById: number;
    data: UpdatePermissionBodyType;
  }): Promise<PermissionType | null> {
    return this.prismaService.permission.update({
      where: {
        id: permissionId,
        deletedAt: null,
      },
      data: {
        ...data,
        updatedById,
      },
    });
  }

  delete(
    { permissionId, deletedById }: { permissionId: number; deletedById: number },
    isHard?: boolean,
  ): Promise<PermissionType | null> {
    return isHard
      ? this.prismaService.permission.delete({
          where: {
            id: permissionId,
          },
        })
      : this.prismaService.permission.update({
          where: {
            id: permissionId,
            deletedAt: null,
          },
          data: {
            deletedAt: new Date(),
            deletedById,
          },
        });
  }
}
