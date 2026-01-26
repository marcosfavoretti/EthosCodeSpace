import { Module } from '@nestjs/common';
import { FabricaModule } from '@app/modules/modules/planejador/Fabrica.module';
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
import { ItemComCapabilidade } from '@app/modules/modules/planejador/@core/entities/Item.entity';
import { PedidoServiceModule } from '@app/modules/modules/planejador/PedidoService.module';
import { PlanejamentoWorkerController } from './delivery/PlanejamentoWorker.controller';

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
    // Mercado,
    // TabelaProducao,
];

@Module({
    imports: [
        FabricaModule,
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
        }),        //configurar banco do syneco
    ],
    controllers: [PlanejamentoWorkerController],
    exports: [],
})
export class PlanejadorWorkerModule { }