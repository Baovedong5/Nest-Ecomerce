import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repo';
import { GoogleService } from './google.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, GoogleService],
})
export class AuthModule {}
