import { NestFactory, Reflector } from '@nestjs/core';
import { EstruturaApiModule } from './estrutura-api.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ClassSerializerInterceptor, Logger } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(EstruturaApiModule);
  const config = new DocumentBuilder()
    .setTitle('Estrutura API')
    .setDescription('api para consulta de estruturas ETHOS')
    .setVersion('1.0')
    .build();
  app.enableCors();
  app.setGlobalPrefix('estrutura');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/doc', app, documentFactory);
  //config service
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT')!;
  const host = configService.get<string>('HOST')!;
  //
  await app
    .listen(port, host)
    .then(() =>
      Logger.log(`swagger: http://${host || 'localhost'}:${port}/api/doc/}`),
    );
}
bootstrap();
