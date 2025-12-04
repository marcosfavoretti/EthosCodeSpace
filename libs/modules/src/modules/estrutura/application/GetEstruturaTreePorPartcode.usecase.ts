import {
  BadRequestException,
  Inject,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { EstruturaNotFound } from '../@core/exceptions/EstruturaNotFound';
import { EstruturaNeo4jDAO } from '../infra/dao/EstruturaNeo4j.dao';
import { Partcode } from '@app/modules/shared/classes/Partcode';
import { ItemEstruturaTree } from '../@core/classes/ItemEstruturaTree';
import { ResEstruturaTreeDTO } from '@app/modules/contracts/dto/ResEstruturaTree.dto';
import { ResEstruturaItemTreeDTO } from '@app/modules/contracts/dto/ResEstruturaItemTree.dto';
import { ResEstruturaItemDTO } from '@app/modules/contracts/dto/ResEstruturaItem.dto';

@Injectable()
export class GetEstruturaTreePorPartcodeUsecase {
  constructor(
    @Inject(EstruturaNeo4jDAO)
    private readonly estruturaNeo4jDAO: EstruturaNeo4jDAO,
  ) {}

  private toDto(item: ItemEstruturaTree): ResEstruturaItemTreeDTO {
    const dto = new ResEstruturaItemTreeDTO();
    dto.status = item.status;
    dto.itemCliente = item.itemCliente;
    dto.partcode = item.partcode;
    dto.ehControle = item.ehControle;

    if (item.children && item.children.length > 0) {
      dto.children = item.children.map((child) => this.toDto(child));
    }

    if (item.father) {
      const fatherDto = new ResEstruturaItemDTO();
      fatherDto.status = item.father.status;
      fatherDto.itemCliente = item.father.itemCliente;
      fatherDto.partcode = item.father.partcode;
      fatherDto.ehControle = item.father.ehControle;
      dto.father = fatherDto;
    }

    return dto;
  }

  async execute(partcode: Partcode): Promise<ResEstruturaTreeDTO> {
    try {
      const estrutura: ItemEstruturaTree | undefined =
        await this.estruturaNeo4jDAO.getEstrutura(partcode);
      const niveis = await this.estruturaNeo4jDAO.getEstruturaDepth(partcode);
      if (!estrutura) throw new EstruturaNotFound(partcode.getPartcodeNum());

      const estruturaDto = this.toDto(estrutura);

      const listStruct: ResEstruturaTreeDTO = {
        detalhes: {
          niveis: niveis,
          ultSync: new Date(),
        },
        estrutura: estruturaDto,
      };
      return listStruct;
    } catch (error) {
      if (error instanceof EstruturaNotFound) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException('Falha ao gerar a estrutura');
    }
  }
}
