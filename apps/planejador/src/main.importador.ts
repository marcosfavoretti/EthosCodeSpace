import { NestFactory } from '@nestjs/core';
import { ImportadorModule } from './Importador.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(ImportadorModule);
    Logger.debug('Importador de pedidos Logix');
}
bootstrap();
