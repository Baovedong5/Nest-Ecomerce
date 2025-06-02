import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './routes/auth/auth.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
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
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import path from 'path';
import { CategoryModule } from './routes/category/category.module';
import { CategoryTranslationModule } from './routes/category/category-translation/category-translation.module';
import { ProductModule } from './routes/product/product.module';
import { ProductTranslationModule } from './routes/product/product-translation/product-translation.module';
import { CartModule } from './routes/cart/cart.module';
import { OrderModule } from './routes/order/order.module';
import { PaymentModule } from './routes/payment/payment.module';
import { BullModule } from '@nestjs/bullmq';
import { PaymentConsumer } from './queues/payment.consumer';
import envConfig from './shared/config';
import { WebSocketModule } from './websockets/websocket.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerBehindProxyGuard } from './shared/guards/throttler-behind-proxy.guard';
import { ReviewModule } from './routes/review/review.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RemoveRefreshTokenCronjob } from './cronjobs/remove-refresh-token.cronjob';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      connection: {
        host: envConfig.REDIS_HOST,
        port: envConfig.REDIS_PORT,
      },
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.resolve('src/i18n/'),
        watch: true,
      },
      resolvers: [{ use: QueryResolver, options: ['lang'] }, AcceptLanguageResolver],
      typesOutputPath: path.resolve('src/generated/i18n.generated.ts'),
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'short',
          ttl: 60000, // 1 minute
          limit: 5,
        },
        {
          name: 'long',
          ttl: 120000, // 2 minutes
          limit: 7,
        },
      ],
    }),
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
    CategoryModule,
    CategoryTranslationModule,
    ProductTranslationModule,
    ProductModule,
    CartModule,
    OrderModule,
    PaymentModule,
    WebSocketModule,
    ReviewModule,
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
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
    PaymentConsumer,
    RemoveRefreshTokenCronjob,
  ],
})
export class AppModule {}
