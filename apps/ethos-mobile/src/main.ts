import { NestFactory } from '@nestjs/core';
import { EthosMobileModule } from './ethos-mobile.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(EthosMobileModule);
  const configService = app.get(ConfigService);
  app.enableCors();
  app.setGlobalPrefix('mobile');

  const port = configService.get<number>('PORT') || 3000;
  const host = configService.get<string>('HOST') || 'localhost';

  const config = new DocumentBuilder()
    .setTitle('Documentação para o app mobile')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/doc', app, documentFactory);
  await app
    .listen(port, host)
    .then(() => console.log(`http://${host}:${port}/api/doc`));
}
bootstrap();
