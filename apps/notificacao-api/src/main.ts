import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { NotificacaoApiModule } from './notificacao-api.module';
import { AttachmentDto } from '@app/modules/contracts/dto/Attachment.dto'; // Import AttachmentDto
import * as express from 'express'; // Import express

async function bootstrap() {
  const app = await NestFactory.create(NotificacaoApiModule);
  const configService = app.get(ConfigService);
  const host = configService.get('HOST');
  const port = configService.get('PORT') ?? 3000;

  app.use(express.json({ limit: '50mb' })); 
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Certificados CAT')
    .setVersion('1.0')
    .build();

  app.enableCors({
    origin: ['https://app.ethos.ind.br', 'http://192.168.99.129:4200'],
    credentials: true,
  });

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [AttachmentDto], // Explicitly add AttachmentDto
  });
  SwaggerModule.setup('api/doc', app, document, {
    raw: ['yaml', 'json'],
    useGlobalPrefix: false,
  });

  app.use(cookieParser());

  await app
    .listen(port, host)
    .then(() => console.log(`http://${host}:${port}/api/doc`));
}
bootstrap();
