import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotasModule } from '@app/modules/modules/notas/Notas.module';
import { NotaWorkerController } from './controller/notas-worker-controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'apps/notas-maker/.env',
      isGlobal: true,
    }),
    NotasModule,
  ],
  controllers: [NotaWorkerController],
})
export class NotasMakerWorkerModule {}
