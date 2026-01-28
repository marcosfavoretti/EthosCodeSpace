import { PedidoModule } from '@app/modules/modules/planejador/Pedido.module';
import { Module } from '@nestjs/common';
import { ImportacaoPolling } from './jobs/ImportacaoPolling';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormSynecoConfig } from '@app/modules/config/TypeormSynecoConfig.module';
import { Cargo } from '@app/modules/modules/user/@core/entities/Cargo.entity';
import { GerenciaCargo } from '@app/modules/modules/user/@core/entities/GerenciaCargo.entity';
import { MergeRequest } from '@app/modules/modules/planejador/@core/entities/MergeRequest.entity';
import { User } from '@app/modules/modules/user/@core/entities/User.entity';
import { Fabrica } from '@app/modules/modules/planejador/@core/entities/Fabrica.entity';
import { Planejamento } from '@app/modules/modules/planejador/@core/entities/Planejamento.entity';
import { PlanejamentoSnapShot } from '@app/modules/modules/planejador/@core/entities/PlanejamentoSnapShot.entity';
import { DividaSnapShot } from '@app/modules/modules/planejador/@core/entities/DividaSnapShot.entity';
import { Divida } from '@app/modules/modules/planejador/@core/entities/Divida.entity';
import { Pedido } from '@app/modules/modules/planejador/@core/entities/Pedido.entity';
import { ItemComCapabilidade } from '@app/modules/modules/planejador/@core/entities/Item.entity';
import { ItemCapabilidade } from '@app/modules/modules/planejador/@core/entities/ItemCapabilidade.entity';
import { Setor } from '@app/modules/modules/planejador/@core/entities/Setor.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PLANEJADOR_QUEUE } from './@core/const/planejador.const';
import { ImportaPedidoLogixUseCase } from '@app/modules/modules/planejador/application/ImportaPedidosLogix.usecase';
import { PedidoServiceModule } from '@app/modules/modules/planejador/PedidoService.module';
import { INotificaFalhas } from '@app/modules/modules/planejador/@core/interfaces/INotificaFalhas';
import { PlanejadorNotificaLoggerService } from '@app/modules/modules/planejador/infra/service/PlanejadorNotificaLogger.service';
import { ItemServiceModule } from '@app/modules/modules/planejador/ItemService.module';

const entities = [
  Cargo,
  GerenciaCargo,
  MergeRequest,
  User,
  Fabrica,
  Planejamento,
  PlanejamentoSnapShot,
  DividaSnapShot,
  Divida,
  Pedido,
  ItemComCapabilidade,
  ItemCapabilidade,
  Setor,
];

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PedidoModule,
    ItemServiceModule,
    PedidoServiceModule,
    ConfigModule.forRoot({
      envFilePath: 'apps/planejador/.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) =>
        typeormSynecoConfig(entities, config),
      imports: [ConfigModule],
      inject: [ConfigService],
      name: 'syneco_database',
    }),
    ClientsModule.registerAsync([
      {
        name: PLANEJADOR_QUEUE,
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>('RABBITMQ_URL')!],
            queue: PLANEJADOR_QUEUE,
            queueOptions: {
              durable: true,
            }
          },
        }),

        inject: [ConfigService],
      },
    ]),
  ],
  providers: [
    {
      provide: INotificaFalhas,
      useClass: PlanejadorNotificaLoggerService,
    },
    ImportacaoPolling, ImportaPedidoLogixUseCase],
  controllers: [],
})
export class ImportadorModule { }
