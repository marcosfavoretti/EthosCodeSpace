import { Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common"
import { IPowerBIAtualizacaoRepository } from "../@core/interfaces/PowerbiBIAtualizacao.abstract";

@Injectable()
export class GetRefreshDatesUseCase {
    constructor(@Inject(IPowerBIAtualizacaoRepository) private powerbirep: IPowerBIAtualizacaoRepository) { }
    async getdate(dataset: number): Promise<Date | null> {
        try {
            const log = await this.powerbirep.findOne({
                where: {
                    dataset: {
                        PowerbiDatasetsID: dataset
                    }
                }
            });
            if (!log) return null;
            return log.severTime;
        } catch (error) {
            Logger.error(error);
            throw new InternalServerErrorException('não foi possivel pegar a data de atualizacao');
        }
    }
}