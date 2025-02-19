import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResponseMessage } from 'src/shared/decorators/response-message.decorator';
import { RegisterBodyDTO, RegisterResDTO } from './auth.dto';
import { ZodSerializerDto } from 'nestjs-zod';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ResponseMessage('Đăng ký thành công')
  @ZodSerializerDto(RegisterResDTO)
  async register(@Body() body: RegisterBodyDTO) {
    return await this.authService.register(body);
  }

  @Post('login')
  @ResponseMessage('Đăng nhập thành công')
  login(@Body() body: any) {
    return this.authService.login(body);
  }

  @Post('refresh-token')
  @ResponseMessage('Lấy token mới thành công')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() body: any) {
    return await this.authService.refreshToken(body.refreshToken);
  }

  @Post('logout')
  @ResponseMessage('Đăng xuất thành công')
  async logout(@Body() body: any) {
    return await this.authService.logout(body.refreshToken);
  }
}
