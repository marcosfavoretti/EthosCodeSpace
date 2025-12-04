import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { NotasMakerApiModule } from './notas-maker-api.module';
import { json, urlencoded } from 'express';
async function bootstrap() {
  const app = await NestFactory.create(NotasMakerApiModule);
  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT') || 3000;
  const host = configService.get<string>('HOST') || 'localhost';

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Documentação para geração de notas')
    .setDescription(
      'modulo para criacao de notas. Sendo elas pdfs, imagens, html...',
    )
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/doc', app, documentFactory);
  await app
    .listen(port, host)
    .then(() => console.log(`http://${host}:${port}/api/doc`));
}
bootstrap();
