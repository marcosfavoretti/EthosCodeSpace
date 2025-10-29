import { Inject, Injectable } from "@nestjs/common";
import { ItemManRepository, RoteiroProps } from "../../@logix/infra/repositories/ItemMan.repository";
import { ManProcessoItemRepository, ManProcessoResult } from "../../@logix/infra/repositories/ManProcessoItem.repository";
import { ConsultaPorPartcodeReqDTO } from "@app/modules/contracts/dto/ConsultaPorPartcodeReq.dto";

@Injectable()
export class ConsultarRoteiroUsecase {
    
    @Inject(ItemManRepository) private itemManRepository: ItemManRepository;
    @Inject(ManProcessoItemRepository) private manProcessoItemRepository: ManProcessoItemRepository;

    async consultar(dto: ConsultaPorPartcodeReqDTO): Promise<string[]> {
        const setores = new Set<string>();
        const roteiroID: RoteiroProps = await this.itemManRepository.roteiroPadrao(dto.partcode);
        const setor: ManProcessoResult[] = await this.manProcessoItemRepository.getOperacao(dto.partcode, roteiroID);
        const setorOp = setor.map(s => s.operacao);
        for (const op of setorOp) {
            setores.add(op);
        }
        return Array.from(setores);
    }
}