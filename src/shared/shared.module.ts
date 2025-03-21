import { Global, Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { HasingService } from './services/hasing.service';
import { TokenService } from './services/token.service';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenGuard } from './guards/access-token.guard';
import { APIKeyGuard } from './guards/api-key.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './guards/authentication.guard';
import { SharedUserRepository } from './repositories/shared-user.repo';
import { EmailService } from './services/email.service';
import { TwoFactorService } from './services/2fa.service';
import { SharedRoleRepository } from './repositories/shared-role.repo';

const sharedServices = [
  PrismaService,
  HasingService,
  TokenService,
  SharedUserRepository,
  EmailService,
  TwoFactorService,
  SharedRoleRepository,
];

@Global()
@Module({
  imports: [JwtModule],
  providers: [
    ...sharedServices,
    AccessTokenGuard,
    APIKeyGuard,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
  ],
  exports: sharedServices,
})
export class SharedModule {}
