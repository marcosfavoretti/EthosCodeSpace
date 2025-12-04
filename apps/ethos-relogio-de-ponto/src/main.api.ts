import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApiModule } from './api.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);


  const config = new DocumentBuilder()
    .setTitle('Ethos Relogio de Ponto API')
    .setDescription('API for Ethos Relogio de Ponto')
    .setVersion('1.0')
    .build();
  //
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;
  const host = configService.get<string>('HOST') || 'localhost';
  //

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/doc', app, document, {
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
    credentials: true
  });

  await app
    .listen(process.env.PORT ?? 3001, '0.0.0.0')
    .then(() => Logger.log(`http://${host}:${port}/api/doc`));
}
bootstrap();
