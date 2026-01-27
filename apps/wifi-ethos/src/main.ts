import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { AppModule } from './App.module';
import { FastApiStyleLoggingInterceptor } from '@app/modules/shared/interceptor/FastApiStyleLoggingInterceptor.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/wifi');
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new FastApiStyleLoggingInterceptor(),
  );
  const config = new DocumentBuilder()
    .setTitle('Ethos Wifi doc')
    .setDescription('controle de codigos wifi do ubiquiti')
    .setVersion('1.0')
    .build();
  //
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;
  const host = configService.get<string>('HOST') || 'localhost';
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

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('doc', app, document, {
    raw: ['yaml', 'json'],
    useGlobalPrefix: true,
  });

  app.enableCors({
    origin: [
      'http://localhost:4200', // Origem mais comum do frontend
      'http://127.0.0.1:4200', // Origem alternativa
      'http://192.168.99.129:4200',
      'http://192.168.99.129:30001', // Outra origem possível (Vue/Webpack)
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.use(cookieParser());
  await app
    .listen(process.env.PORT ?? 3000, '0.0.0.0')
    .then(() => Logger.log(`http://${host}:${port}/api/wifi/doc`));
}
bootstrap();
