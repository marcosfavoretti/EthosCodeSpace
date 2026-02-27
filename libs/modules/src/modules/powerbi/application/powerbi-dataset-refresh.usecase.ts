import { BadRequestException, Inject, Logger, NotFoundException, Injectable } from "@nestjs/common";
import { IPowerbiAtualizador } from "../@core/interfaces/powerbi-atualizador.abstract";
import { IPowerbiDatasetsRepository } from "../@core/interfaces/IPowerbiDatasetsRepository";
import { IPowerBIAtualizacaoRepository } from "../@core/interfaces/PowerbiBIAtualizacao.abstract";
import { EntityNotFoundError } from "typeorm";
import { IPowerbiRefreshObserver } from "../@core/interfaces/IPowerbiRefreshObserver";
import { PreActionExecutorService } from "../infra/services/PreActionsExecutor.service";
import { PowerbiStateStoreService } from "../@core/service/PowerbiStateStore.service";

@Injectable()
export class PowerbiDatasetRefreshUseCase {
  constructor(
    @Inject(IPowerbiDatasetsRepository) private pbiDatasetsRepo: IPowerbiDatasetsRepository,
    @Inject(IPowerbiAtualizador) private refreshService: IPowerbiAtualizador,
    @Inject(IPowerBIAtualizacaoRepository) private powerbiLogg: IPowerBIAtualizacaoRepository,
    private stateStore: PowerbiStateStoreService,
    private preActionService: PreActionExecutorService,
  ) { }

  async execute(dto: { datasetID: number, admin: boolean, observer?: IPowerbiRefreshObserver, authorName?: string }) {
    if (this.stateStore.isLocked()) {
      throw new BadRequestException('Atualização bloqueada para evitar problemas com dados. Alguma outra atualização está em andamento');
    }

    this.stateStore.lock(dto.authorName);

    try {
      const { admin, observer } = dto

      const dataset = await this.pbiDatasetsRepo.findOneByOrFail({ PowerbiDatasetsID: dto.datasetID });

      if (admin) {
        dataset.setAdminEnable();
        await this.preActionService.exec(dataset, observer);
      }

      Logger.debug(`Iniciando atualização: ${dataset.name}`);

      await this.powerbiLogg
        .save(this.powerbiLogg.create({
          dataset: dataset,
          severTime: new Date()
        }));

      await this.refreshService.refreshPowerbi(dataset, observer);

      return dataset;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException('Dataset não encontrado');
      }
      if (error instanceof BadRequestException) throw error;
      Logger.error(error);
      throw new BadRequestException('Erro ao atualizar dataset, tente novamente mais tarde.');
    } finally {
      // O reset final do estado deve ser tratado por quem chamou se houver mensagens específicas de conclusão,
      // mas garantimos que o 'using' volte para false aqui se nada mais for feito.
      // No entanto, para não sobrescrever mensagens de sucesso do WS, podemos apenas dar um unlock genérico 
      // se ainda estiver 'using'.
      if (this.stateStore.isLocked()) {
        this.stateStore.unlock('Atualização finalizada');
      }
    }
  }
}
