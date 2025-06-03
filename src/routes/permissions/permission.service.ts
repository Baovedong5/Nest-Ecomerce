import { Inject, Injectable } from '@nestjs/common';
import { PermissionRepository } from './permission.repo';
import { CreatePermissionBodyType, UpdatePermissionBodyType } from './permission.model';
import { NotFoundRecordException } from 'src/shared/error';
import { isNotFoundPrismaError, isUniqueConstraintPrismaError } from 'src/shared/helper';
import { PermissionAlreadyExistsException } from './permission.error';
import { PaginationQueryDTO } from 'src/shared/dtos/request.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class PermissionService {
  constructor(
    private readonly permissionRepository: PermissionRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async list(pagination: PaginationQueryDTO) {
    const data = await this.permissionRepository.list(pagination);

    return data;
  }

  async findById(id: number) {
    const permission = await this.permissionRepository.findById(id);

    if (!permission) {
      throw NotFoundRecordException;
    }

    return permission;
  }

  async create({ data, createdById }: { data: CreatePermissionBodyType; createdById: number }) {
    try {
      return this.permissionRepository.create({ data, createdById });
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw PermissionAlreadyExistsException;
      }

      throw error;
    }
  }

  async update({
    permissionId,
    data,
    updatedById,
  }: {
    permissionId: number;
    data: UpdatePermissionBodyType;
    updatedById: number;
  }) {
    try {
      const permission = await this.permissionRepository.update({ permissionId, updatedById, data });

      const { roles } = permission;

      await this.deleteCachedRole(roles);

      return permission;
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException;
      }

      if (isUniqueConstraintPrismaError(error)) {
        throw PermissionAlreadyExistsException;
      }

      throw error;
    }
  }

  async delete({ permissionId, deletedById }: { permissionId: number; deletedById: number }) {
    try {
      const permission = await this.permissionRepository.delete({ permissionId, deletedById });

      const { roles } = permission;

      await this.deleteCachedRole(roles);

      return {
        message: 'Xóa thành công',
      };
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException;
      }

      throw error;
    }
  }

  deleteCachedRole(roles: { id: number }[]) {
    return Promise.all(
      roles.map((role) => {
        const cacheKey = `role:${role.id}`;
        return this.cacheManager.del(cacheKey);
      }),
    );
  }
}
