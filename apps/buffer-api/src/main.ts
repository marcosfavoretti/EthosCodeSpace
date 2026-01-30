import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { FastApiStyleLoggingInterceptor } from '@app/modules/shared/interceptor/FastApiStyleLoggingInterceptor.interceptor';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { BufferApiModule } from './buffer-api.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(BufferApiModule);

  app.setGlobalPrefix('api/buffer');
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new FastApiStyleLoggingInterceptor(),
  );

  const config = new DocumentBuilder()
    .setTitle('Buffer API')
    .setDescription('Buffer api swagger')
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

  SwaggerModule.setup('doc', app, document, {
    raw: ['yaml', 'json'],
    useGlobalPrefix: true,
  });
  app.enableCors({
    origin: [
      'app.ethos.ind.br',
      'http://192.168.99.129:4200',
      'https://app.prod.ethos',
    ],
    credentials: true,
  });

  app.use(cookieParser());
  await app.listen(port, host).then(() => {
    Logger.log(`http://${host || 'localhost'}:${port}/api/buffer/doc`);
  });
}
bootstrap();
