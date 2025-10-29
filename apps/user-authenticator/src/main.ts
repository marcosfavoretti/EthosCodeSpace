import { NestFactory } from '@nestjs/core';
import { UserAuthenticatorModule } from './user-authenticator.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(UserAuthenticatorModule);

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('User Authenticator API')
    .setDescription('API for user authentication and management')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/doc', app, document);

  await app.listen(process.env.port ?? 3000);
}
bootstrap();
