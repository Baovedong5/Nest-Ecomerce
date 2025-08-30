import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './shared/interceptors/transform.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WebsocketAdapter } from './websockets/websocket.adapter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { Logger } from 'nestjs-pino';
import { cleanupOpenApiDoc } from 'nestjs-zod';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // const app = await NestFactory.create<NestExpressApplication>(AppModule, {
  //   bufferLogs: true,
  // });

  const reflector = app.get(Reflector);

  //logger
  // app.useLogger(app.get(Logger));

  //declare interceptor global
  // app.useGlobalInterceptors(new TransformInterceptor(reflector));

  //declare cors
  app.enableCors();

  //helmet
  app.use(helmet());

  app.useGlobalInterceptors(new LoggingInterceptor());

  //trust proxy
  app.set('trust proxy', 'loopback');

  const config = new DocumentBuilder()
    .setTitle('Ecommerce API')
    .setDescription('The emcomerce API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addApiKey(
      {
        name: 'payment-api-key',
        type: 'apiKey',
        in: 'headers',
      },
      'payment-key',
    )
    .build();
  const documentFactory = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, cleanupOpenApiDoc(documentFactory), {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const websocketAdapter = new WebsocketAdapter(app);
  await websocketAdapter.connectToRedis();

  app.useWebSocketAdapter(websocketAdapter);

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
