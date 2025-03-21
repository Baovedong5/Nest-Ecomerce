import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repo';
import { HasingService } from 'src/shared/services/hasing.service';
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repo';
import { SharedRoleRepository } from 'src/shared/repositories/shared-role.repo';
import { CreateUserBodyType, GetUserQueryType, UpdateUserBodyType } from './user.model';
import { RoleName } from 'src/shared/constants/role.constant';
import {
  isForeignKeyConstraintPrismaError,
  isNotFoundPrismaError,
  isUniqueConstraintPrismaError,
} from 'src/shared/helper';
import { CannotUpdateOrDeleteYourselfException, RoleNotFoundException, UserAlreadyExistsException } from './user.error';
import { NotFoundRecordException } from 'src/shared/error';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private hashingService: HasingService,
    private readonly sharedUserRepository: SharedUserRepository,
    private readonly sharedRoleRepository: SharedRoleRepository,
  ) {}

  async list(pagination: GetUserQueryType) {
    return await this.userRepository.list(pagination);
  }

  async findById(id: number) {
    const user = await this.sharedUserRepository.findUniqueInclueRolePermissions({
      id,
      deletedAt: null,
    });

    return user;
  }

  /**
   *
   * Function này kiểm tra xem người thực hiện có quyền tác động đến người khác không
   * Chỉ có admin role mới có quyền: Tạo admin user, update roleId thành admin, xóa admin user
   * Còn nếu không phải admin thì không được phép tác động đến admin
   */

  private async verifyRole({ roleNameAgent, roleIdTarget }) {
    //Agent là admin thì cho phép
    if (roleNameAgent === RoleName.Admin) {
      return true;
    } else {
      //Agent không phải admin thì roleIdTarget phải khác admin
      const adminRoleId = await this.sharedRoleRepository.getAdminRoleId();
      if (roleIdTarget === adminRoleId) {
        throw new ForbiddenException();
      }

      return true;
    }
  }

  async create({
    data,
    createdById,
    createdByRoleName,
  }: {
    data: CreateUserBodyType;
    createdById: number;
    createdByRoleName: string;
  }) {
    try {
      // Chỉ có admin agent mới có quyền tạo user với role là admin
      await this.verifyRole({
        roleNameAgent: createdByRoleName,
        roleIdTarget: data.roleId,
      });

      // Hash password
      const hashedPassword = await this.hashingService.hash(data.password);

      // Tạo user
      const user = await this.userRepository.create({
        createdById,
        data: {
          ...data,
          password: hashedPassword,
        },
      });

      return user;
    } catch (error) {
      if (isForeignKeyConstraintPrismaError(error)) {
        throw RoleNotFoundException;
      }

      if (isUniqueConstraintPrismaError(error)) {
        throw UserAlreadyExistsException;
      }

      throw error;
    }
  }

  async update({
    id,
    data,
    updatedById,
    updatedByRoleName,
  }: {
    id: number;
    data: UpdateUserBodyType;
    updatedById: number;
    updatedByRoleName: string;
  }) {
    try {
      //Không thể cập nhật chính minh
      if (id === updatedById) {
        throw CannotUpdateOrDeleteYourselfException;
      }

      const currentUser = await this.sharedUserRepository.findUnique({
        id,
        deletedAt: null,
      });

      if (!currentUser) {
        throw NotFoundRecordException;
      }

      //Lấy roleId ban đầu của người được update kiểm tra xem liệu người update có quyền update không
      // Không dùng data.roleId vì dữ liệu có thể bị truyền sai
      const roleIdTarget = currentUser.roleId;

      await this.verifyRole({
        roleIdTarget,
        roleNameAgent: updatedByRoleName,
      });

      const updateUser = await this.sharedUserRepository.update(
        { id, deletedAt: null },
        {
          ...data,
          updatedById,
        },
      );

      return updateUser;
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException;
      }

      if (isUniqueConstraintPrismaError(error)) {
        throw UserAlreadyExistsException;
      }

      if (isForeignKeyConstraintPrismaError(error)) {
        throw RoleNotFoundException;
      }

      throw error;
    }
  }

  async delete({ id, deletedById, deletedByRoleName }: { id: number; deletedById: number; deletedByRoleName: string }) {
    try {
      //Không thể xóa chính mình
      if (id === deletedById) {
        throw CannotUpdateOrDeleteYourselfException;
      }

      const currentUser = await this.sharedUserRepository.findUnique({
        id,
        deletedAt: null,
      });

      if (!currentUser) {
        throw NotFoundRecordException;
      }

      const roleIdTarget = currentUser.roleId;

      await this.verifyRole({
        roleIdTarget,
        roleNameAgent: deletedByRoleName,
      });

      await this.userRepository.delete({ id, deletedById });

      return {
        message: 'Xóa user thành công',
      };
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException;
      }

      throw error;
    }
  }
}
