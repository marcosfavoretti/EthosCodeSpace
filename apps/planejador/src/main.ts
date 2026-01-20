import { NestFactory, Reflector } from '@nestjs/core';
import { PlanejadorApiModule } from './planejador-api.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { FastApiStyleLoggingInterceptor } from '@app/modules/shared/interceptor/FastApiStyleLoggingInterceptor.interceptor';


const SERVICE_NAME = `
  Swagger planejador fabril
`

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    PlanejadorApiModule,
  );

  app.setGlobalPrefix('api/planejador');
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new FastApiStyleLoggingInterceptor(),
  );

  const config = new DocumentBuilder()
    .setTitle('Planejador API')
    .setDescription('Planejador api swagger')
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
  //define politicas de cors seguras
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
    Logger.debug(SERVICE_NAME, 'SERVICE NAME');
    Logger.log(`http://${host || 'localhost'}:${port}/api/doc`);
  });
}
bootstrap();
