import {
  BadRequestException,
  Inject,
  Logger,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { ItemNotFoundException } from '../@core/exceptions/ItemNotFound';
import { EstruturaNeo4jDAO } from '../infra/dao/EstruturaNeo4j.dao';
import { Partcode } from '@app/modules/shared/classes/Partcode';
import { ResEstruturaDependentesDTO } from '@app/modules/contracts/dto/ResEstruturaDependentes.dto';

@Injectable()
export class GetEstruturasDependentesUsecase {
  @Inject(EstruturaNeo4jDAO) private estruturaNeo4jDAO: EstruturaNeo4jDAO;

  async getdependentes(
    partcode: Partcode,
  ): Promise<ResEstruturaDependentesDTO> {
    try {
      const [dependentes, item] = await Promise.all([
        this.estruturaNeo4jDAO.listEstruturasDependentes(partcode),
        this.estruturaNeo4jDAO.getItem(partcode),
      ]);
      if (!item) throw new ItemNotFoundException(partcode.getPartcodeNum());
      const itemDependencia: ResEstruturaDependentesDTO = {
        depedencias: dependentes,
        target: item,
      };
      return itemDependencia;
    } catch (error) {
      if (error instanceof ItemNotFoundException)
        throw new NotFoundException(error.message);
      throw new BadRequestException(
        'Erro ao buscar estruturas dependentes',
        error.message,
      );
    }
  }
}
