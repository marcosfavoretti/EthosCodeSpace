import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { WorkerModule } from './worker.module';
import { ConfigService } from '@nestjs/config';
import { PROCESSA_PONTO_QUEUE } from './@core/symbols/symbols';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(WorkerModule);
  const configService = appContext.get(ConfigService);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    WorkerModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [configService.get<string>('RABBITMQ_URL')!],
        queue: PROCESSA_PONTO_QUEUE,
        queueOptions: {
          durable: true,
        },
      },
    },
  );
  
  app.useGlobalPipes(
    new ValidationPipe({ transform: true, })
  );
  await app.listen();
}
bootstrap();
