import { Injectable } from '@nestjs/common';
import { InvalidPasswordException, NotFoundRecordException } from 'src/shared/error';
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repo';
import { HasingService } from 'src/shared/services/hasing.service';
import { ChangePasswordBodyType, UpdateMeBodyType } from './profile.model';
import { isUniqueConstraintPrismaError } from 'src/shared/helper';

@Injectable()
export class ProfileService {
  constructor(
    private readonly sharedUserRepository: SharedUserRepository,
    private readonly hashingService: HasingService,
  ) {}

  async getProfile(userId: number) {
    const user = await this.sharedUserRepository.findUniqueInclueRolePermissions({
      id: userId,
      deletedAt: null,
    });

    if (!user) {
      throw NotFoundRecordException;
    }

    return user;
  }

  async updateProfile({ userId, body }: { userId: number; body: UpdateMeBodyType }) {
    try {
      return await this.sharedUserRepository.update(
        {
          id: userId,
          deletedAt: null,
        },
        {
          ...body,
          updatedById: userId,
        },
      );
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw NotFoundRecordException;
      }

      throw error;
    }
  }

  async changePassword({ userId, body }: { userId: number; body: Omit<ChangePasswordBodyType, 'confirmNewPassword'> }) {
    try {
      const { newPassword, password } = body;

      const user = await this.sharedUserRepository.findUnique({
        id: userId,
        deletedAt: null,
      });

      if (!user) {
        throw NotFoundRecordException;
      }

      const isPasswordMatch = await this.hashingService.compare(password, user.password);

      if (!isPasswordMatch) {
        throw InvalidPasswordException;
      }

      const hashedPassword = await this.hashingService.hash(newPassword);

      await this.sharedUserRepository.update(
        { id: userId, deletedAt: null },
        {
          password: hashedPassword,
          updatedById: userId,
        },
      );

      return {
        message: 'Thay đổi mật khẩu thành công',
      };
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw NotFoundRecordException;
      }

      throw error;
    }
  }
}
