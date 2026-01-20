import { NestFactory } from '@nestjs/core';
import { BufferApiModule } from './buffer-api.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(BufferApiModule);

  const config = new DocumentBuilder()
    .setTitle('Buffer API')
    .setDescription('API para gerenciamento de Buffer')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/doc', app, document);

  await app
    .listen(process.env.port ?? 3000)
    .then(() => Logger.debug('http://localhost:3000/api/doc'));
}
bootstrap();
