import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppEthosApiModule } from './app-ethos-api.module';

async function bootstrap() {
  const app =
    await NestFactory.create<NestExpressApplication>(AppEthosApiModule);

  app.setGlobalPrefix('api/route/');

  const config = new DocumentBuilder()
    .setTitle('User Authenticator API')
    .setDescription('API for user authentication and management')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  //config service
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;
  const host = configService.get<string>('HOST')!;
  //
  /**config */
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  //
  const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api/doc', app, document, {
  //   raw: ['yaml', 'json'],
  //   useGlobalPrefix: true,
  // });
  SwaggerModule.setup('doc', app, document, {
    raw: ['yaml', 'json'],
    useGlobalPrefix: true,
  });
  //define politicas de cors seguras
  app.enableCors({
    origin: [
      'app.ethos.ind.br/api',
      'http://192.168.99.129:4200',
      'https://app.prod.ethos',
    ],
    credentials: true,
  });

  app.use(cookieParser());
  await app.listen(port, host).then(() => {
    Logger.log(`http://${host || 'localhost'}:${port}/api/doc`);
  });
}
bootstrap();
