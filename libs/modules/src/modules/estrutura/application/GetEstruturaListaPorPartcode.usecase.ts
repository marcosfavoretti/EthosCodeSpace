import {
  BadRequestException,
  Inject,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { EstruturaNotFound } from '../@core/exceptions/EstruturaNotFound';
import { EstruturaNeo4jDAO } from '../infra/dao/EstruturaNeo4j.dao';
import { Partcode } from '@app/modules/shared/classes/Partcode';
import { ResEstruturaListaDTO } from '@app/modules/contracts/dto/ResEstruturaLista.dto';
import { ResEstruturaItemDTO } from '@app/modules/contracts/dto/ResEstruturaItem.dto';

@Injectable()
export class GetEstruturaListaPorPartcodeUsecase {
  constructor(
    @Inject(EstruturaNeo4jDAO)
    private readonly estruturaNeo4jDAO: EstruturaNeo4jDAO,
  ) {}

  async execute(partcode: Partcode): Promise<ResEstruturaListaDTO> {
    try {
      const estrutura =
        await this.estruturaNeo4jDAO.getEstruturaAsList(partcode);
      if (!estrutura) throw new EstruturaNotFound(partcode.getPartcodeNum());
      //TODO anexar metricas globais para estruturas
      const niveis = await this.estruturaNeo4jDAO.getEstruturaDepth(partcode);
      const response = estrutura.map((e) => ({
        ehControle: e.ehControle,
        itemCliente: e.itemCliente,
        partcode: e.partcode,
        status: e.status,
        qtd: e.qtd,
      }));
      const listStruct: ResEstruturaListaDTO = {
        detalhes: {
          niveis: niveis,
          ultSync: new Date(),
        },
        estrutura: response,
      };
      return listStruct;
    } catch (error) {
      if (error instanceof EstruturaNotFound) {
        throw new NotFoundException(error.message);
      }
      console.log(error);
      throw new BadRequestException('Falha ao gerar a estrutura');
    }
  }
}
