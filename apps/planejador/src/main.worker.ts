import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ImportadorModule } from './Importador.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(ImportadorModule);

  const configService = app.get(ConfigService);

  Logger.debug(`
    \r\nMaster producer started... relogios monitorados:\r\n${configService.get(
      'RELOGIO_ENDPOINTS',
    )}\n`);
}
bootstrap();
