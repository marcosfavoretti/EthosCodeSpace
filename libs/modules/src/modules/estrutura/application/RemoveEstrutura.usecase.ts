import { Inject, Injectable } from "@nestjs/common";
import { EstruturaRepository } from "../../../@logix/infra/repositories/Estrutura.repository";
import { Partcode } from "src/modules/shared/classes/Partcode";

@Injectable()
export class RemoveEstruturaUsecase {
    constructor(@Inject(EstruturaRepository) private estructRepository: EstruturaRepository) { }
    async remove(partcode: Partcode): Promise<void> {
        await this.estructRepository.deleteEstrutura(partcode);
    }
}