import { Body, Controller, Post, Ip, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResponseMessage } from 'src/shared/decorators/response-message.decorator';
import {
  LoginBodyDTO,
  LoginResDTO,
  RefreshTokenBodyDTO,
  RegisterBodyDTO,
  RegisterResDTO,
  SendOTPBodyDTO,
} from './auth.dto';
import { ZodSerializerDto } from 'nestjs-zod';
import { UserAgent } from 'src/shared/decorators/user-agent.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  // @ResponseMessage('Đăng ký thành công')
  @ZodSerializerDto(RegisterResDTO)
  register(@Body() body: RegisterBodyDTO) {
    return this.authService.register(body);
  }

  @Post('otp')
  // @ResponseMessage('Đăng ký thành công')
  sendOTP(@Body() body: SendOTPBodyDTO) {
    return this.authService.sendOTP(body);
  }

  @Post('login')
  @ZodSerializerDto(LoginResDTO)
  // @ResponseMessage('Đăng nhập thành công')
  login(@Body() body: LoginBodyDTO, @UserAgent() userAgent: string, @Ip() ip: string) {
    return this.authService.login({
      ...body,
      userAgent,
      ip,
    });
  }

  @Post('refresh-token')
  @ResponseMessage('Lấy token mới thành công')
  @HttpCode(HttpStatus.OK)
  refreshToken(@Body() body: RefreshTokenBodyDTO, @UserAgent() userAgent: string, @Ip() ip: string) {
    return this.authService.refreshToken({
      refreshToken: body.refreshToken,
      userAgent,
      ip,
    });
  }

  // @Post('logout')
  // @ResponseMessage('Đăng xuất thành công')
  // async logout(@Body() body: any) {
  //   return await this.authService.logout(body.refreshToken);
  // }
}
