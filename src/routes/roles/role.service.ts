import { Injectable } from '@nestjs/common';
import { RoleRepository } from './role.repo';
import { CreateRoleBodyType, GetRolesQueryType, UpdateRoleBodyType } from './role.model';
import { NotFoundRecordException } from 'src/shared/error';
import { isNotFoundPrismaError, isUniqueConstraintPrismaError } from 'src/shared/helper';
import { RoleAlreadyExistsException } from './role.error';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async list(pagination: GetRolesQueryType) {
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
      const role = await this.roleRepository.update({ id, data, updatedById });
      return role;
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
      await this.roleRepository.delete({
        id,
        deletedById,
      });
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
