import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { DeviceType, RefreshTokenType, VerificationCodeType } from './auth.model';
import { UserType } from 'src/shared/models/shared-user.model';
import { TypeOfVerifycationCodeType } from 'src/shared/constants/auth.constant';
import { WhereUniqueUserType } from 'src/shared/repositories/shared-user.repo';
import { RoleType } from 'src/shared/models/shared-role.model';

@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(
    user: Pick<UserType, 'email' | 'name' | 'password' | 'phoneNumber' | 'roleId'>,
  ): Promise<Omit<UserType, 'password' | 'totpSecret'>> {
    return await this.prismaService.user.create({
      data: user,
      omit: {
        password: true,
        totpSecret: true,
      },
    });
  }

  async createUserInclueRole(
    user: Pick<UserType, 'email' | 'name' | 'password' | 'avatar' | 'phoneNumber' | 'roleId'>,
  ): Promise<UserType & { role: RoleType }> {
    return await this.prismaService.user.create({
      data: user,
      include: {
        role: true,
      },
    });
  }

  async createVerificationCode(payload: Pick<VerificationCodeType, 'email' | 'code' | 'expiresAt' | 'type'>) {
    return await this.prismaService.verificationCode.upsert({
      where: {
        email_type: {
          email: payload.email,
          type: payload.type,
        },
      },
      create: payload,
      update: {
        code: payload.code,
        expiresAt: payload.expiresAt,
      },
    });
  }

  async findUniqueVerificationCode(
    uniqueValue:
      | { id: number }
      | {
          email_type: {
            email: string;
            type: TypeOfVerifycationCodeType;
          };
        },
  ): Promise<VerificationCodeType | null> {
    return await this.prismaService.verificationCode.findUnique({
      where: uniqueValue,
    });
  }

  createRefreshToken(data: { token: string; userId: number; expiresAt: Date; deviceId: number }) {
    return this.prismaService.refreshToken.create({
      data,
    });
  }

  createDevice(
    data: Pick<DeviceType, 'userId' | 'userAgent' | 'ip'> & Partial<Pick<DeviceType, 'lastActive' | 'isActive'>>,
  ) {
    return this.prismaService.device.create({
      data,
    });
  }

  async findUniqueUserIncludeRole(uniqueObject: WhereUniqueUserType): Promise<(UserType & { role: RoleType }) | null> {
    return this.prismaService.user.findFirst({
      where: {
        ...uniqueObject,
        deletedAt: null,
      },
      include: {
        role: true,
      },
    });
  }

  async findUniqueRefreshTokenIncludeUserRole(uniqueObject: {
    token: string;
  }): Promise<(RefreshTokenType & { user: UserType & { role: RoleType } }) | null> {
    return await this.prismaService.refreshToken.findUnique({
      where: uniqueObject,
      include: {
        user: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  updateDevice(deviceId: number, data: Partial<DeviceType>): Promise<DeviceType> {
    return this.prismaService.device.update({
      where: {
        id: deviceId,
      },
      data,
    });
  }

  deleteRefreshToken(uniqueObject: { token: string }): Promise<RefreshTokenType> {
    return this.prismaService.refreshToken.delete({
      where: uniqueObject,
    });
  }

  deleteVerificationCode(
    uniqueObject: { id: number } | { email_type: { email: string; type: TypeOfVerifycationCodeType } },
  ): Promise<VerificationCodeType> {
    return this.prismaService.verificationCode.delete({
      where: uniqueObject,
    });
  }
}
