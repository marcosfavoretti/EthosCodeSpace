import { Module } from '@nestjs/common';
import { LogixServiceModule } from '../@logix/LogixService.module';
import { SynecoServiceModule } from '../@syneco/SynecoService.module';
import { ConsultarRoteiroUsecase } from './application/ConsultarRoteiro.usecase';
import { ExportEstruturaUsecase } from './application/ExportEstrutura.usecase';
import { GetEstruturaListaPorPartcodeUsecase } from './application/GetEstruturaListaPorPartcode.usecase';
import { GetEstruturasDependentesUsecase } from './application/GetEstruturasDependentes.usecase';
import { ListaEstruturasUsecase } from './application/ListaEstruturas.usecase';
import { RemoveEstruturaUsecase } from './application/RemoveEstrutura.usecase';
import { ConsultaItensDeControleUsecase } from './application/ConsultaItensDeControleUsecase';
import { ImagemDaEstruturaUsecase } from './application/ImagemDaEstruturaUsecase';
import { EstruturaNeo4jDAO } from './infra/dao/EstruturaNeo4j.dao';
import { LoadEstruturaOracleService } from './infra/service/LoadEstruturaOracle.service';
import { CommitInNeo4jService } from './infra/service/CommitInNeo4j.service';
import { EstruturaOracleDAO } from './infra/dao/EstruturaOracle.dao';
import { ManProcessoItemRepository } from '../@logix/infra/repositories/ManProcessoItem.repository';
import { ItemManRepository } from '../@logix/infra/repositories/ItemMan.repository';
import { ImagemEstruturaRepositoryService } from './infra/service/ImageRepository.service';
import { StorageModule } from '../storage/Storage.module';

@Module({
  imports: [SynecoServiceModule, StorageModule],
  providers: [
    ConsultaItensDeControleUsecase,
    ConsultarRoteiroUsecase,
    ExportEstruturaUsecase,
    GetEstruturaListaPorPartcodeUsecase,
    GetEstruturasDependentesUsecase,
    EstruturaNeo4jDAO,
    ImagemDaEstruturaUsecase,
    ListaEstruturasUsecase,
    CommitInNeo4jService,
    RemoveEstruturaUsecase,
    LoadEstruturaOracleService,
    EstruturaOracleDAO,
    ManProcessoItemRepository,
    ItemManRepository,
    ImagemEstruturaRepositoryService,
  ],
  exports: [
    ImagemEstruturaRepositoryService,
    ItemManRepository,
    ManProcessoItemRepository,
    EstruturaOracleDAO,
    CommitInNeo4jService,
    ConsultaItensDeControleUsecase,
    ConsultarRoteiroUsecase,
    LoadEstruturaOracleService,
    EstruturaNeo4jDAO,
    ExportEstruturaUsecase,
    GetEstruturaListaPorPartcodeUsecase,
    GetEstruturasDependentesUsecase,
    ImagemDaEstruturaUsecase,
    ListaEstruturasUsecase,
    RemoveEstruturaUsecase,
  ],
})
export class EstruturaServiceModule {}
