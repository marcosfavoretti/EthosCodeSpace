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
import { BullModule } from '@nestjs/bull';
import { queues } from '@app/modules/modules/planejador/@core/const/queue';
import { ScheduleModule } from '@nestjs/schedule';

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
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST, // nome do serviço do docker-compose
        port: +process.env.REDIS_PORT!,
      },
    }),
    BullModule.registerQueue({
      name: queues.planejamento,
    }),
  ],
  providers: [ImportacaoPolling],
  controllers: [],
})
export class ImportadorModule {}
