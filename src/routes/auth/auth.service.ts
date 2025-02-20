import { ConflictException, Injectable } from '@nestjs/common';
import { HasingService } from 'src/shared/services/hasing.service';
import { PrismaService } from 'src/shared/services/prisma.service';
import { TokenService } from 'src/shared/services/token.service';
import { RolesService } from './roles.service';
import { isUniqueConstraintPrismaError } from 'src/shared/helper';
import { RegisterBodyType } from './auth.model';
import { AuthRepository } from './auth.repo';

@Injectable()
export class AuthService {
  constructor(
    private readonly hasingService: HasingService,
    private readonly tokenService: TokenService,
    private readonly rolesService: RolesService,
    private readonly authRepository: AuthRepository,
  ) {}

  async register(body: RegisterBodyType) {
    try {
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
        throw new ConflictException('Email đã tồn tại');
      }

      throw error;
    }
  }

  login(body: any) {}

  refreshToken(refreshToken: string) {}

  logout(refreshToken: string) {}
}
