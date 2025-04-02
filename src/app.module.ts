import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './routes/auth/auth.module';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import CustomZodValidationPipe from './shared/pipes/custom-zod-validation.pipe';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { ZodSerializerInterceptor } from 'nestjs-zod';
import { LanguagesModule } from './routes/languages/language.module';
import { PermissionModule } from './routes/permissions/permission.module';
import { RoleModule } from './routes/roles/role.module';
import { ProfileModule } from './routes/profile/profile.module';
import { UserModule } from './routes/users/user.module';
import { MediaModule } from './routes/media/media.module';
import { BrandTranslationModule } from './routes/brand/brand-translation/brand-translation.module';
import { BrandModule } from './routes/brand/brand.module';

@Module({
  imports: [
    SharedModule,
    AuthModule,
    LanguagesModule,
    PermissionModule,
    RoleModule,
    ProfileModule,
    UserModule,
    MediaModule,
    BrandModule,
    BrandTranslationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: CustomZodValidationPipe,
    },
    { provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
