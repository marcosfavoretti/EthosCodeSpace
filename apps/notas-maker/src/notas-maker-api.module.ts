import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NotasModule } from '@app/modules/modules/notas/Notas.module';
import { NotasOrquestradasController } from './controller/notas-orquestradas.controller';
import { __NOTAS_QUEUE } from './@core/symbols';
import { NOTA_QUEUE } from './@core/consts';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'apps/notas-maker/.env',
      isGlobal: true,
    }),
    NotasModule,
    ClientsModule.registerAsync([
      {
        name: __NOTAS_QUEUE,
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL')!],
            queue: NOTA_QUEUE,
            queueOptions: {
              durable: false,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [NotasOrquestradasController],
})
export class NotasMakerApiModule {}
