import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './shared/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const reflector = app.get(Reflector);

  //declare interceptor global
  app.useGlobalInterceptors(new TransformInterceptor(reflector));

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
