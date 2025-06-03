import { Inject, Injectable } from '@nestjs/common';
import { RoleRepository } from './role.repo';
import { CreateRoleBodyType, UpdateRoleBodyType } from './role.model';
import { NotFoundRecordException } from 'src/shared/error';
import { isNotFoundPrismaError, isUniqueConstraintPrismaError } from 'src/shared/helper';
import { ProhibitedActionsOnBaseRoleException, RoleAlreadyExistsException } from './role.error';
import { RoleName } from 'src/shared/constants/role.constant';
import { PaginationQueryDTO } from 'src/shared/dtos/request.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RoleService {
  constructor(
    private readonly roleRepository: RoleRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async list(pagination: PaginationQueryDTO) {
    const roles = await this.roleRepository.list(pagination);

    return roles;
  }

  async findById(id: number) {
    const role = await this.roleRepository.findById(id);

    if (!role) {
      throw NotFoundRecordException;
    }

    return role;
  }

  /**
   * Kiểm tra xem role có phải là 1 trong 3 role cơ bản không
   */
  private async verifyRole(roleId: number) {
    const role = await this.roleRepository.findById(roleId);

    if (!role) {
      throw NotFoundRecordException;
    }

    const baseRoles: string[] = [RoleName.Admin, RoleName.Client, RoleName.Seller];

    if (baseRoles.includes(role.name)) {
      throw ProhibitedActionsOnBaseRoleException;
    }
  }

  async create({ createdById, data }: { createdById: number; data: CreateRoleBodyType }) {
    try {
      const role = await this.roleRepository.create({ createdById, data });
      return role;
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw RoleAlreadyExistsException;
      }

      throw error;
    }
  }

  async update({ id, data, updatedById }: { id: number; data: UpdateRoleBodyType; updatedById: number }) {
    try {
      await this.verifyRole(id);

      const updateRole = await this.roleRepository.update({ id, data, updatedById });

      await this.cacheManager.del(`role:${updateRole?.id}`);

      return updateRole;
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw RoleAlreadyExistsException;
      }

      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException;
      }

      throw error;
    }
  }

  async delete({ id, deletedById }: { id: number; deletedById: number }) {
    try {
      await this.verifyRole(id);

      await this.roleRepository.delete({
        id,
        deletedById,
      });

      await this.cacheManager.del(`role:${id}`);

      return {
        message: 'Xóa role thành công',
      };
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException;
      }
      throw error;
    }
  }
}
