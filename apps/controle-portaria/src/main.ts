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
import { AppModule } from './app.module';
import { FastApiStyleLoggingInterceptor } from '@app/modules/shared/interceptor/FastApiStyleLoggingInterceptor.interceptor';
import * as express from 'express';

async function bootstrap() {
  const app =
    await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(express.json({ limit: '50mb' }));
  app.setGlobalPrefix('api/controle-portaria');

  const config = new DocumentBuilder()
    .setTitle('Controle de Portaria API')
    .setDescription('API para controle de entrada e saída de veículos na portaria.')
    .setVersion('1.0')
    .addBearerAuth() // Assuming authentication might be added later, consistent with example
    .build();

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3001; // Use a distinct port
  const host = configService.get<string>('HOST') || '0.0.0.0'; // Default to 0.0.0.0 for Docker compatibility

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  );

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new FastApiStyleLoggingInterceptor(),
  );
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document, {
    raw: ['yaml', 'json'],
    useGlobalPrefix: true,
  });

  app.enableCors({
    origin: true, // Be more restrictive in production
    credentials: true,
  });

  app.use(cookieParser());
  await app.listen(port, host).then(() => {
    Logger.log(`Controle de Portaria API listening on http://${host}:${port}/api/controle-portaria/doc`);
  });
}
bootstrap();