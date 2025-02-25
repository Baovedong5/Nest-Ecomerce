import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { HasingService } from 'src/shared/services/hasing.service';
import { TokenService } from 'src/shared/services/token.service';
import { RolesService } from './roles.service';
import { generateOTP, isUniqueConstraintPrismaError } from 'src/shared/helper';
import { LoginBodyType, RegisterBodyType, SendOTPBodyType } from './auth.model';
import { AuthRepository } from './auth.repo';
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repo';
import { addMilliseconds } from 'date-fns';
import envConfig from 'src/shared/config';
import ms from 'ms';
import { TypeOfVerifycationCode } from 'src/shared/constants/auth.constant';
import { EmailService } from 'src/shared/services/email.service';
import { AccessTokenPayloadCreate } from 'src/shared/types/jwt.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly hasingService: HasingService,
    private readonly rolesService: RolesService,
    private readonly authRepository: AuthRepository,
    private readonly sharedUserRepository: SharedUserRepository,
    private readonly emailService: EmailService,
    private readonly tokenService: TokenService,
  ) {}

  async register(body: RegisterBodyType) {
    try {
      //1. kiểm tra xem mã code có hợp lệ hoặc hết hạn không
      const verificationCode = await this.authRepository.findUniqueVerificationCode({
        email: body.email,
        code: body.code,
        type: TypeOfVerifycationCode.REGISTER,
      });

      if (!verificationCode) {
        throw new UnprocessableEntityException([
          {
            message: 'Mã OTP không hợp lệ',
            path: 'code',
          },
        ]);
      }

      if (verificationCode.expiresAt < new Date()) {
        throw new UnprocessableEntityException([
          {
            message: 'Mã OTP đã hết hạn',
            path: 'code',
          },
        ]);
      }

      //2. dang ky user
      //2.1 lay cache role id client
      const clientRoleId = await this.rolesService.getClientRoleId();
      const hashedPassword = await this.hasingService.hash(body.password);

      return await this.authRepository.createUser({
        email: body.email,
        name: body.name,
        phoneNumber: body.phoneNumber,
        password: hashedPassword,
        roleId: clientRoleId,
      });
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw new UnprocessableEntityException([
          {
            message: 'Email đã tồn tại',
            path: 'email',
          },
        ]);
      }

      throw error;
    }
  }

  async sendOTP(body: SendOTPBodyType) {
    //1. kiểm tra xem email đã tồn tại trong db chưa
    const user = await this.sharedUserRepository.findUnique({
      email: body.email,
    });

    if (user) {
      throw new UnprocessableEntityException([
        {
          message: 'Email đã tồn tại',
          path: 'email',
        },
      ]);
    }

    //2. tạo mã OTP
    const code = generateOTP();
    const verificationCode = this.authRepository.createVerificationCode({
      email: body.email,
      code,
      type: body.type,
      expiresAt: addMilliseconds(new Date(), ms(envConfig.OTP_EXPIRES_IN)),
    });

    //3. gửi mã OTP
    const { error } = await this.emailService.sendOTP({
      email: body.email,
      code,
    });

    if (error) {
      throw new UnprocessableEntityException([
        {
          message: 'Gửi mã OTP thất bại',
          path: 'code',
        },
      ]);
    }

    return verificationCode;
  }

  async login(body: LoginBodyType & { userAgent: string; ip: string }) {
    //check email exisit database ?
    const user = await this.authRepository.findUniqueUserIncludeRole({
      email: body.email,
    });

    if (!user) {
      throw new UnprocessableEntityException([
        {
          message: 'Email không tồn tại',
          path: 'email',
        },
      ]);
    }

    //check password
    const isPasswordMatch = await this.hasingService.compare(body.password, user.password);
    if (!isPasswordMatch) {
      throw new UnprocessableEntityException([
        {
          field: 'password',
          error: 'Mật khẩu không đúng',
        },
      ]);
    }

    //Tạo device mới
    const device = await this.authRepository.createDevice({
      userId: user.id,
      userAgent: body.userAgent,
      ip: body.ip,
    });

    //create access token and refresh token
    const tokens = await this.generateTokens({
      userId: user.id,
      deviceId: device.id,
      roleId: user.roleId,
      roleName: user.role.name,
    });

    return tokens;
  }

  async generateTokens({ userId, deviceId, roleId, roleName }: AccessTokenPayloadCreate) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken({
        userId,
        deviceId,
        roleId,
        roleName,
      }),
      this.tokenService.signRefreshToken({
        userId,
      }),
    ]);

    const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken);

    await this.authRepository.createRefreshToken({
      token: refreshToken,
      userId,
      expiresAt: new Date(decodedRefreshToken.exp * 1000),
      deviceId,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  // async refreshToken(refreshToken: string) {
  //   try {
  //     //1. Kiểm tra token có hợp lệ hay không
  //     const { userId } = await this.tokenService.verifyRefreshToken(refreshToken);

  //     //2. Kiểm tra refresh token có tồn tại trong database không
  //     await this.prismaService.refreshToken.findUniqueOrThrow({
  //       where: {
  //         token: refreshToken,
  //       },
  //     });

  //     //3. Xóa refresh token cũ
  //     await this.prismaService.refreshToken.delete({
  //       where: {
  //         token: refreshToken,
  //       },
  //     });

  //     //4. Tao token mới
  //     return await this.generateTokens({ userId });
  //   } catch (error) {
  //     // Trường hợp đã refresh token hãy thông báo cho user biết
  //     // refresh token của họ đã bị đánh cắp
  //     if (isNotFoundPrismaError(error)) throw new UnauthorizedException('Invalid token');

  //     throw new UnauthorizedException('Invalid token');
  //   }
  // }

  logout(refreshToken: string) {}
}
