import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { PlanejadorWorkerModule } from './PlanejadorWorker.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { PLANEJADOR_QUEUE } from './@core/const/planejador.const';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(PlanejadorWorkerModule);
  const configSertvice = appContext.get(ConfigService);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(PlanejadorWorkerModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [configSertvice.get<string>('RABBITMQ_URL')!],
        queue: PLANEJADOR_QUEUE,
        noAck: false,
        queueOptions: {
          durable: true,
        },
      },
    }
  )
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen();
  Logger.log('👨‍🏭worker para planejar👨‍🏭')
}
bootstrap();
