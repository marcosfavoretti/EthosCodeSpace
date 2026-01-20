import { Module } from '@nestjs/common';
import { PipeFrabricacaoProvider } from './PipeFrabricacao.provider';
import { GerenciadorPlanejamento } from './infra/service/GerenciadorPlanejamento';
import { IGerenciadorPlanejamentoMutation } from './@core/interfaces/IGerenciadorPlanejamento';
import { IGerenciadorPlanejamentConsulta } from './@core/interfaces/IGerenciadorPlanejamentoConsulta';
import { FabricaService } from './infra/service/Fabrica.service';
import { FabricaSimulacaoService } from './infra/service/FabricaSimulacao.service';
import { FabricaRepository } from './infra/repository/Fabrica.repository';
import { ConsultaPlanejamentoService } from './infra/service/ConsultaPlanejamentos.service';
import { EfetivaPlanejamentoService } from './infra/service/EfetivaPlanejamento.service';
import { PlanejamentoSnapShotRepository } from './infra/repository/PlanejamentoSnapShot.repository';
import { ForkFabricaService } from './infra/service/ForkFabrica.service';
import { DeletaSnapShotService } from './infra/service/DeletaSnapShot.service';
import { PlanejamentoCheckPoint } from './infra/service/PlanejamentoCheckpoint.service';
import { IGeraCheckPoint } from './@core/interfaces/IGeraCheckPoint';
import { DividaService } from './infra/service/Divida.service';
import { DividaRepository } from './infra/repository/Divida.repository';
import { ValidaCapacidade } from './@core/services/ValidaCapacidade';
import { PlanejamentoValidatorExecutorService } from './@core/services/PlanejamentoValidatorExecutor.service';
import { ValidaData } from './@core/services/ValidaData';
import { SetorFabricaProviders } from './SetorFabrica.provider';
import { DividaSnapShotRepository } from './infra/repository/DividaSnapShot.repository';
import { GerenciaDividaService } from './infra/service/GerenciaDivida.service';
import { DividaCheckPoint } from './infra/service/DividaCheckpoint.service';
import { SetorChainFactoryService } from './@core/services/SetorChainFactory.service';
import { ApagaPedidoPlanejadoService } from './infra/service/ApagaPedidoPlanejado.service';
import { ReplanejarPedidoUseCase } from './application';
import { BuscaPedidosService } from './infra/service/BuscaPedidos.service';
import { OnNovoPlanejamentoProvider } from './OnNovoPlanejamento.provider';
import {
  ValidadorPlanejamento,
  ValidadorPlanejamentoProvider,
} from './ValidaPlenejamento.provider';
import { ValidaFabricaProvider } from './ValidaFabrica.provider';
import { ValidaFabricaPai } from './infra/service/ValidaFabricaPai.service';
import { ValidaFabricaPlanejamento } from './infra/service/ValidaFabricaPlanejamento.service';
import { MergeRequestService } from './infra/service/MergeRequest.service';
import { MergeRequestRepository } from './infra/repository/MergeRequest.repository';
import { ICalculoDivida } from './@core/interfaces/ICalculoDivida';
import { CalculaDividaDoPlanejamento } from './@core/services/CalculaDividaDoPlanejamento';
import { config } from 'dotenv';
import { ComparaMudancaFabricaExecutorService } from './@core/services/ComparaMudancaFabricaExecutor.service';
import { ValidMudancaFabricaEstrategiasProvider } from './MudancaFabrica.provider';
import { MudancaPedido } from './@core/services/MudancaPedido';
import { MudancaPlanejamento } from './@core/services/MudancaPlanejamento';
import { MudancaQtdPlanejamento } from './@core/services/MudancaQtdPlanejamento';
import { PedidoServiceModule } from './PedidoService.module';
import { PlanejamentoServiceModule } from './PlanejamentoService.module';
import { ItemServiceModule } from './ItemService.module';

import { PlanejamentoRepository } from './infra/repository/Planejamento.repository';
config();
@Module({
  imports: [PlanejamentoServiceModule, PedidoServiceModule, ItemServiceModule],
  providers: [
    ComparaMudancaFabricaExecutorService,
    MergeRequestService,
    ValidaFabricaPai,
    MudancaPedido,
    MudancaQtdPlanejamento,
    MudancaPlanejamento,
    ValidMudancaFabricaEstrategiasProvider,
    ValidaFabricaPlanejamento,
    ValidaFabricaProvider,
    ValidadorPlanejamentoProvider,
    OnNovoPlanejamentoProvider,
    ...SetorFabricaProviders,
    DividaService,
    DividaRepository,
    DeletaSnapShotService,
    PlanejamentoRepository,
    PipeFrabricacaoProvider,
    ApagaPedidoPlanejadoService,
    SetorChainFactoryService,
    ValidaCapacidade,
    BuscaPedidosService,
    DividaCheckPoint,
    PlanejamentoValidatorExecutorService,
    ValidaData,
    {
      provide: ICalculoDivida,
      useClass: CalculaDividaDoPlanejamento,
    },
    {
      provide: IGerenciadorPlanejamentConsulta,
      useClass: GerenciadorPlanejamento,
    },
    {
      provide: IGerenciadorPlanejamentoMutation,
      useClass: GerenciadorPlanejamento,
    },
    {
      provide: 'CHECKPOINT_SERVICES',
      useFactory: (
        planejamentoCheckPoint: IGeraCheckPoint,
        dividaCheckPoint: IGeraCheckPoint,
      ) => [planejamentoCheckPoint, dividaCheckPoint],
      inject: [PlanejamentoCheckPoint, DividaCheckPoint],
    },
    PlanejamentoCheckPoint,
    FabricaService,
    ForkFabricaService,
    FabricaRepository,
    ConsultaPlanejamentoService,
    FabricaSimulacaoService,
    EfetivaPlanejamentoService,
    PlanejamentoSnapShotRepository,
    GerenciaDividaService,
    DividaSnapShotRepository,
    ReplanejarPedidoUseCase,
    MergeRequestRepository,
  ],
  exports: [
    MergeRequestService,
    MergeRequestRepository,
    ValidadorPlanejamento,
    ComparaMudancaFabricaExecutorService,
    ValidaFabricaPai,
    ValidaFabricaPlanejamento,
    ValidaFabricaProvider,
    OnNovoPlanejamentoProvider,
    GerenciaDividaService,
    ReplanejarPedidoUseCase,
    DividaSnapShotRepository,
    DividaService,
    DividaRepository,
    BuscaPedidosService,
    ApagaPedidoPlanejadoService,
    PlanejamentoCheckPoint,
    'CHECKPOINT_SERVICES',
    ForkFabricaService,
    PlanejamentoSnapShotRepository,
    SetorChainFactoryService,
    DeletaSnapShotService,
    EfetivaPlanejamentoService,
    ConsultaPlanejamentoService,
    FabricaRepository,
    FabricaSimulacaoService,
    FabricaService,
    IGerenciadorPlanejamentConsulta,

    IGerenciadorPlanejamentoMutation,
    FabricaService,
    PlanejamentoRepository,
    PipeFrabricacaoProvider,
  ],
})
export class FabricaServiceModule {}
