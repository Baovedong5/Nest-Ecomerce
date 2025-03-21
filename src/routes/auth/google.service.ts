import { Injectable } from '@nestjs/common';
import { GoogleAuthStateType } from './auth.model';
import { google } from 'googleapis';
import envConfig from 'src/shared/config';
import { OAuth2Client } from 'google-auth-library';
import { AuthRepository } from './auth.repo';
import { HasingService } from 'src/shared/services/hasing.service';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from './auth.service';
import { GoogleUserInfoError } from './auth.error';
import { SharedRoleRepository } from 'src/shared/repositories/shared-role.repo';

@Injectable()
export class GoogleService {
  private oauth2Client: OAuth2Client;
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly hasingService: HasingService,
    private readonly sharedRoleRepository: SharedRoleRepository,
    private readonly authService: AuthService,
  ) {
    this.oauth2Client = new google.auth.OAuth2(
      envConfig.GOOGLE_CLIENT_ID,
      envConfig.GOOGLE_CLIENT_SECRET,
      envConfig.GOOGLE_REDIRECT_URL,
    );
  }

  getGoogleAuthorizationUrl({ userAgent, ip }: GoogleAuthStateType) {
    //1. Tạo quyền truy cập cho ứng dụng
    const scope = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ];

    //2. convert chuỗi object sang string base64
    const stateString = Buffer.from(JSON.stringify({ userAgent, ip })).toString('base64');

    //3. tạo url
    const url = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope,
      state: stateString,
      include_granted_scopes: true,
    });

    return {
      url,
    };
  }

  async googleCallback({ code, state }: { code: string; state: string }) {
    try {
      let userAgent = 'Unknown';
      let ip = 'Unknown';

      //1. lấy state từ url chuyển sang object
      try {
        if (state) {
          const clientInfo = JSON.parse(Buffer.from(state, 'base64').toString()) as GoogleAuthStateType;
          userAgent = clientInfo.userAgent;
          ip = clientInfo.ip;
        }
      } catch (error) {
        console.error('Error parse state', error);
      }

      //2. lấy token từ google
      const { tokens } = await this.oauth2Client.getToken(code);
      this.oauth2Client.setCredentials(tokens);

      //3. lấy thông tin google user
      const oauth2 = google.oauth2({ version: 'v2', auth: this.oauth2Client });
      const { data } = await oauth2.userinfo.get();

      if (!data.email) {
        throw GoogleUserInfoError;
      }

      //4. kiểm tra email người dùng
      let user = await this.authRepository.findUniqueUserIncludeRole({
        email: data.email,
      });

      //4.1. Nếu không có user tức là người mới, tiến hành register user
      if (!user) {
        const clientRoleId = await this.sharedRoleRepository.getClientRoleId();

        //4.2 Tạo random password cho người dùng khi login bằng google
        const randomPassword = uuidv4();
        const hashedPassword = await this.hasingService.hash(randomPassword);

        //4.3 Tạo user mới
        user = await this.authRepository.createUserInclueRole({
          email: data.email,
          name: data.name ?? '',
          phoneNumber: '',
          password: hashedPassword,
          roleId: clientRoleId,
          avatar: data.picture ?? null,
        });
      }

      //5. Tạo device mới
      const device = await this.authRepository.createDevice({
        userAgent,
        ip,
        userId: user.id,
      });

      //6. Tạo token mới
      const authTokens = await this.authService.generateTokens({
        userId: user.id,
        deviceId: device.id,
        roleId: user.roleId,
        roleName: user.role.name,
      });

      return authTokens;
    } catch (error) {
      console.error('Error google callback', error);
      throw error;
    }
  }
}
