import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './shared/interceptors/transform.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const reflector = app.get(Reflector);

  //declare interceptor global
  // app.useGlobalInterceptors(new TransformInterceptor(reflector));

  //declare cors
  app.enableCors();

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
