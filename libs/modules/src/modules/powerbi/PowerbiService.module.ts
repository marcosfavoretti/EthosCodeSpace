import { Module } from "@nestjs/common";
import { PowerbiDatasetsRepository } from "./infra/repository/PowerbiDatasets.repository";
import { PowerbiAtualizacoesRepository } from "./infra/repository/powerbi-bi.repository";
import { IPowerbiDatasetsRepository } from "./@core/interfaces/IPowerbiDatasetsRepository";
import { IPowerBIAtualizacaoRepository } from "./@core/interfaces/PowerbiBIAtualizacao.abstract";
import { IPowerbiAtualizador } from "./@core/interfaces/powerbi-atualizador.abstract";
import { PowerbiAtualizadorService } from "./infra/services/powerbi-atualizador.service";
import { IWebAutomation } from "./@core/interfaces/web-automation.abstract";
import { PuppeteerAutomation } from "./infra/services/puppeteer-automation";
import { PreActionExecutorService } from "./infra/services/PreActionsExecutor.service";
import { MicroServiceProductionRelation } from "./infra/services/ProductionRelation.service";
import { MockPreActionService } from "./infra/services/MockPreAction.service";
import { PowerbiStateStoreService } from "./@core/service/PowerbiStateStore.service";
import { ICheckRaceCondicion } from "./@core/interfaces/ICheckRaceCondicion";
import { PowerbiRefreshLockService } from "./@core/service/PowerbiRefreshLock.service";

@Module({
  providers: [
    {
      provide: IPowerbiDatasetsRepository,
      useClass: PowerbiDatasetsRepository,
    },
    {
      provide: IPowerBIAtualizacaoRepository,
      useClass: PowerbiAtualizacoesRepository,
    },
    {
      provide: IPowerbiAtualizador,
      useClass: PowerbiAtualizadorService,
    },
    {
      provide: ICheckRaceCondicion,
      useClass: PowerbiRefreshLockService,
    },
    {
      provide: IWebAutomation,
      useClass: PuppeteerAutomation,
    },
    MockPreActionService,
    PreActionExecutorService,
    MicroServiceProductionRelation,
    PowerbiStateStoreService,
  ],
  exports: [
    MockPreActionService,
    PowerbiStateStoreService,
    MicroServiceProductionRelation,
    IPowerbiDatasetsRepository,
    PreActionExecutorService,
    IPowerBIAtualizacaoRepository,
    IPowerbiAtualizador,
    IWebAutomation,
    ICheckRaceCondicion
  ],
})
export class PowerbiserviceModule{}
