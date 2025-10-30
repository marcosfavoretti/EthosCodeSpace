import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { NotasMakerWorkerModule } from './notas-maker-worker.module';
import { __NOTAS_QUEUE } from './@core/symbols';
import { NOTA_QUEUE } from './@core/consts';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(NotasMakerWorkerModule);
  const configService = appContext.get(ConfigService);

  const app = await NestFactory.createMicroservice(NotasMakerWorkerModule, {
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URL')],
      queue: NOTA_QUEUE,
      queueOptions: {
        durable: false,
      },
    },
  });

  await app.listen();
  console.log('Worker is listening');
  await appContext.close();
}
bootstrap();