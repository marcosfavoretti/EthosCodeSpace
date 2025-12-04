import { NestFactory } from '@nestjs/core';
import { EthosProducaoModule } from './ethos-producao.module';

async function bootstrap() {
  const app = await NestFactory.create(EthosProducaoModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
