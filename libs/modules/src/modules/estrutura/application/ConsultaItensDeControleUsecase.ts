import { ItemEstruturaResDTO } from "@app/modules/contracts/dto/EstruturaItemRes.dto";
import { ConsultaPorPartcodeReqDTO } from "@app/modules/contracts/dto/ConsultaPorPartcodeReq.dto";
import { Inject, InternalServerErrorException } from "@nestjs/common";
import { EstruturaNeo4jDAO } from "../infra/dao/Estrutura.dao";
import type { IConsultaEstrutura } from "../@core/interfaces/IConsutaEstrutura";

export class ConsultaItensDeControleUsecase {
    @Inject(EstruturaNeo4jDAO) private estruturaNeo4jDAO: IConsultaEstrutura

    async consulta(dto: ConsultaPorPartcodeReqDTO): Promise<ItemEstruturaResDTO[]> {
        try {
            const resolution = await this.estruturaNeo4jDAO
                .getItensDeControle(dto.partcode);
            return resolution;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}