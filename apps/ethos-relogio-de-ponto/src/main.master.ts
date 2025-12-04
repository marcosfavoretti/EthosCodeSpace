import { NestFactory } from '@nestjs/core';
import { MasterModule } from './master.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(MasterModule);

  const configService = app.get(ConfigService);

  Logger.debug(`
    \r\nMaster producer started... relogios monitorados:\r\n${configService.get(
      'RELOGIO_ENDPOINTS',
    )}\n`);
}
bootstrap();
