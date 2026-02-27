import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { IPowerbiDatasetsRepository } from "../@core/interfaces/IPowerbiDatasetsRepository";
import { PowerbiDatasets } from "../@core/entities/PowerbiDatasets.entity";
import { AssingPowerbiDatasetDTO } from "@app/modules/contracts/dto/AssignPowerbiDataset.dto";

@Injectable()
export class AssignDatasetUsecase {
    constructor(
        @Inject(IPowerbiDatasetsRepository) private pbiRepo: IPowerbiDatasetsRepository
    ) {}

    async assing(dto: AssingPowerbiDatasetDTO): Promise<PowerbiDatasets> {
        try {
            const dataset = this.pbiRepo.create(dto);
            return await this.pbiRepo.save(dataset);
        } catch (error) {
            throw new InternalServerErrorException('Não foi possível criar o link do PowerBI');
        }
    }
}
