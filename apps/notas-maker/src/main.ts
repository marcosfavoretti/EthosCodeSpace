import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { NotasMakerApiModule } from './notas-maker-api.module';
import { json, urlencoded } from 'express';
async function bootstrap() {
  const app = await NestFactory.create(NotasMakerApiModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;
  app.use(json({ limit: '50mb' })); // Para payloads JSON
  app.use(urlencoded({ extended: true, limit: '50mb' })); // Para payloads de formulário (x-www-form-urlencoded)
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  app.enableCors();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/doc', app, documentFactory);
  await app.listen(port, '192.168.99.129')
    .then(
      () => console.log(`http://localhost:${port}/api/doc`)
    );
}
bootstrap();
