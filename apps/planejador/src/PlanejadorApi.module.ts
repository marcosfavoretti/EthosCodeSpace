import { Module } from '@nestjs/common';
import { PlanejamentoController } from './delivery/Planejamento.controller';
import { CargosModule } from '@app/modules/modules/user/Cargos.module';
import { FabricaModule } from '@app/modules/modules/planejador/Fabrica.module';
import { UserModule } from '@app/modules/modules/user/User.module';
import { KpiModule } from '@app/modules/modules/planejador/Kpi.module';
import { PlanejamentoModule } from '@app/modules/modules/planejador/Planejamento.module';
import { PedidoModule } from '@app/modules/modules/planejador/Pedido.module';
import { ItemModule } from '@app/modules/modules/planejador/Item.module';
import { TerminusModule } from '@nestjs/terminus';
import { DonoDaFabricaGuard } from '@app/modules/modules/planejador/@core/guard/dono-da-fabrica.guard';
import { HealthController } from '@app/modules/shared/controller/Health.controller';
import { KPIController } from './delivery/Kpi.controller';
import { PedidoController } from './delivery/Pedido.controller';
import { FabricaController } from './delivery/Fabrica.controller';
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
import { ItemCapabilidade } from '@app/modules/modules/planejador/@core/entities/ItemCapabilidade.entity';
import { Setor } from '@app/modules/modules/planejador/@core/entities/Setor.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FabricaServiceModule } from '@app/modules/modules/planejador/FabricaService.module';
import { ItemComCapabilidade } from '@app/modules/modules/planejador/@core/entities/Item.entity';
import { SharedAuthModule } from '@app/modules/shared/modules/SharedAuth.module';
import { ItemController } from './delivery/Item.controller';

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
    SharedAuthModule.forRoot(),
    CargosModule,
    FabricaModule,
    UserModule,
    KpiModule,
    PlanejamentoModule,
    PedidoModule,
    ItemModule,
    TerminusModule,
    FabricaServiceModule,
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
  ],
  providers: [DonoDaFabricaGuard],
  controllers: [
    ItemController,
    HealthController,
    KPIController,
    PedidoController,
    FabricaController,
    PlanejamentoController,
  ],
})
export class PlanejadorApiModule {}
