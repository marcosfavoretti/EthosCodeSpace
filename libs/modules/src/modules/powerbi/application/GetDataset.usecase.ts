import { Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { IPowerbiDatasetsRepository } from "../@core/interfaces/IPowerbiDatasetsRepository";
import { ConfigService } from "@nestjs/config";
import { User } from "../../user/@core/entities/User.entity";
import { CargoEnum } from "../../user/@core/enum/CARGOS.enum";
import { ResPowerbiDataset } from "@app/modules/contracts/dto/ResPowerbiDataset.dto";

@Injectable()
export class GetDatasetsUseCase {
    constructor(
        @Inject(IPowerbiDatasetsRepository) private pbiRepo: IPowerbiDatasetsRepository,
    ) { }

    async get(payload: User): Promise<ResPowerbiDataset[]> {
        try {
            const cargos = payload.cargosLista;
            if (
                [CargoEnum.ADMIN, CargoEnum.DIRETOR, CargoEnum.ADMIN_POWERBI_VIEW]
                    .some(cargo => cargos.includes(cargo))
            ) {
                return await this.pbiRepo.find()
            }
            return await this.pbiRepo.find({
                where: {
                    adminView: false
                }
            })
        } catch (error) {
            throw new InternalServerErrorException('Não foi possível consultar os datasets');
        }
    }
}
