import { Body, Controller, Post, Ip, HttpCode, HttpStatus, Get, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResponseMessage } from 'src/shared/decorators/response-message.decorator';
import {
  DisableTwoFactorBodyDTO,
  ForgotPasswordBodyDTO,
  GetAuthorizationUrlResDTO,
  LoginBodyDTO,
  LoginResDTO,
  LogoutBodyDTO,
  RefreshTokenBodyDTO,
  RefreshTokenResDTO,
  RegisterBodyDTO,
  RegisterResDTO,
  SendOTPBodyDTO,
  TwoFatorSetupResDTO,
} from './auth.dto';
import { ZodResponse, ZodSerializerDto } from 'nestjs-zod';
import { UserAgent } from 'src/shared/decorators/user-agent.decorator';
import { MessageResDTO } from 'src/shared/dtos/response.dto';
import { IsPublic } from 'src/shared/decorators/auth.decorator';
import { GoogleService } from './google.service';
import { Response } from 'express';
import envConfig from 'src/shared/config';
import { EmptyBodyDTO } from 'src/shared/dtos/request.dto';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly googleService: GoogleService,
  ) {}

  @IsPublic()
  @Post('register')
  // @ResponseMessage('Đăng ký thành công')
  @ZodResponse({ type: RegisterResDTO })
  register(@Body() body: RegisterBodyDTO) {
    return this.authService.register(body);
  }

  @IsPublic()
  @Post('otp')
  // @ResponseMessage('Đăng ký thành công')
  @ZodResponse({ type: MessageResDTO })
  sendOTP(@Body() body: SendOTPBodyDTO) {
    return this.authService.sendOTP(body);
  }

  @IsPublic()
  @Post('login')
  @ZodResponse({ type: LoginResDTO })
  // @ResponseMessage('Đăng nhập thành công')
  login(@Body() body: LoginBodyDTO, @UserAgent() userAgent: string, @Ip() ip: string) {
    return this.authService.login({
      ...body,
      userAgent,
      ip,
    });
  }

  @IsPublic()
  @Post('refresh-token')
  // @ResponseMessage('Lấy token mới thành công')
  @HttpCode(HttpStatus.OK)
  @ZodResponse({ type: RefreshTokenResDTO })
  refreshToken(@Body() body: RefreshTokenBodyDTO, @UserAgent() userAgent: string, @Ip() ip: string) {
    return this.authService.refreshToken({
      refreshToken: body.refreshToken,
      userAgent,
      ip,
    });
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  // @ResponseMessage('Đăng xuất thành công')
  @ZodResponse({ type: MessageResDTO })
  logout(@Body() body: LogoutBodyDTO) {
    return this.authService.logout(body.refreshToken);
  }

  @Get('google-link')
  @IsPublic()
  @ZodResponse({ type: GetAuthorizationUrlResDTO })
  getGoogleAuthorizationUrl(@UserAgent() userAgent: string, @Ip() ip: string) {
    return this.googleService.getGoogleAuthorizationUrl({
      userAgent,
      ip,
    });
  }

  @Get('google/callback')
  @IsPublic()
  async googleCallback(@Query('code') code: string, @Query('state') state: string, @Res() res: Response) {
    try {
      const data = await this.googleService.googleCallback({
        code,
        state,
      });

      return res.redirect(
        `${envConfig.GOOGLE_CLIENT_REDIRECT_URL}?accessToken=${data.accessToken}&refreshToken=${data.refreshToken}`,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Đã xảy ra lỗi khi đăng nhập bằng google, vui lòng thử lại';
      return res.redirect(`${envConfig.GOOGLE_CLIENT_REDIRECT_URL}?errorMessage=${message}`);
    }
  }

  @Post('forgot-password')
  @IsPublic()
  @ZodResponse({ type: MessageResDTO })
  forgotPassword(@Body() body: ForgotPasswordBodyDTO) {
    return this.authService.forgotPassword(body);
  }

  @Post('2fa/setup')
  @ZodResponse({ type: TwoFatorSetupResDTO })
  setupTwoFactorAuth(@Body() _: EmptyBodyDTO, @ActiveUser('userId') userId: number) {
    return this.authService.setupTwoFactorAuth(userId);
  }

  @Post('2fa/disable')
  @ZodResponse({ type: MessageResDTO })
  disableTwoFactorAuth(@Body() body: DisableTwoFactorBodyDTO, @ActiveUser('userId') userId: number) {
    return this.authService.disableTwoFactorAuth({
      ...body,
      userId,
    });
  }
}
