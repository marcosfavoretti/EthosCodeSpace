import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CertificadosCatModuleApi } from './certificados-cat.module';
import cookieParser from 'cookie-parser';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(CertificadosCatModuleApi);
  const configService = app.get(ConfigService);
  const host = configService.get('HOST');
  const port = configService.get('PORT') ?? 3000;

  app.setGlobalPrefix('api')

  const config = new DocumentBuilder()
    .setTitle('Certificados CAT')
    .setVersion('1.0')
    .build();

  app.enableCors({
    origin: ['https://app.ethos.ind.br', 'http://192.168.99.129:4200'],
    credentials: true,
  });

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
  SwaggerModule.setup('api/doc', app, documentFactory, {
    raw: ['yaml', 'json'],
    useGlobalPrefix: false,
  });

  app.use(cookieParser());

  await app
    .listen(port, host)
    .then(() => console.log(`http://${host}:${port}/api/doc`));
}
bootstrap();
