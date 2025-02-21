import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { HasingService } from 'src/shared/services/hasing.service';
import { TokenService } from 'src/shared/services/token.service';
import { RolesService } from './roles.service';
import { generateOTP, isUniqueConstraintPrismaError } from 'src/shared/helper';
import { RegisterBodyType, SendOTPBodyType } from './auth.model';
import { AuthRepository } from './auth.repo';
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repo';
import { addMilliseconds } from 'date-fns';
import envConfig from 'src/shared/config';
import ms from 'ms';
import { TypeOfVerifycationCode } from 'src/shared/constants/auth.constant';

@Injectable()
export class AuthService {
  constructor(
    private readonly hasingService: HasingService,
    private readonly tokenService: TokenService,
    private readonly rolesService: RolesService,
    private readonly authRepository: AuthRepository,
    private readonly sharedUserRepository: SharedUserRepository,
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

    return verificationCode;
  }

  login(body: any) {}

  refreshToken(refreshToken: string) {}

  logout(refreshToken: string) {}
}
