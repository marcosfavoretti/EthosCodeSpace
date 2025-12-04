import { NestFactory } from '@nestjs/core';
import { UserAuthenticatorModule } from './user-authenticator.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

const SERVICE_NAME = `
 __      _____          __  .__                     
 \\ \\    /  _  \\  __ ___/  |_|  |__                  
  \\ \\  /  /_\\  \\|  |  \\   __\\  |  \\                 
  / / /    |    \\  |  /|  | |   Y  \\                
 /_/  \\____|__  /____/ |__| |___|  /                
              \\/                 \\/                 
  _________                  .__                 __ 
 /   _____/ ______________  _|__| ____  ____    / / 
 \\_____  \\_/ __ \\_  __ \\  \\/ /  |/ ___\\/ __ \\  / /  
 /        \\  ___/|  | \\/\\   /|  \\  \\__\\  ___/  \\ \\  
/_______  /\\___  >__|    \\_/ |__|\\___  >___  >  \\_\\ 
        \\/     \\/                    \\/    \\/       `;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    UserAuthenticatorModule,
  );

  app.setBaseViewsDir(join(__dirname, 'views'));
  app.setViewEngine('hbs');

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('User Authenticator API')
    .setDescription('API for user authentication and management')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  //config service
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;
  const host = configService.get<string>('HOST')!;
  //
  const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api/doc', app, document, {
  //   raw: ['yaml', 'json'],
  //   useGlobalPrefix: true,
  // });
  SwaggerModule.setup('api/doc', app, document, {
    raw: ['yaml', 'json'],
    useGlobalPrefix: false,
  });
  //define politicas de cors seguras
  app.enableCors({
    origin: [
      'app.ethos.ind.br/api',
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
