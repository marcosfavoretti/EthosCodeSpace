import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ItemManRepository } from '../../@logix/infra/repositories/ItemMan.repository';
import { ManProcessoItemRepository } from '../../@logix/infra/repositories/ManProcessoItem.repository';
import { ConsultaPorPartcodeReqDTO } from '@app/modules/contracts/dto/ConsultaPorPartcodeReq.dto';

@Injectable()
export class ConsultarRoteiroUsecase {
  @Inject(ItemManRepository) private itemManRepository: ItemManRepository;
  @Inject(ManProcessoItemRepository)
  private manProcessoItemRepository: ManProcessoItemRepository;

  async consultar(dto: ConsultaPorPartcodeReqDTO): Promise<string[]> {
    try {
      const roteiroID = await this.itemManRepository.roteiroPadrao(
        dto.partcode,
      );
      const setor = await this.manProcessoItemRepository.getOperacao(
        dto.partcode,
        {
          idRoteiro: roteiroID.codRoteiro,
          numRoteiro: roteiroID.numAlternRoteiro,
        },
      );
      const setoresUnicos = new Set<string>();
      setor.forEach((s) => setoresUnicos.add(s.operacao));
      return Array.from(setoresUnicos);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
