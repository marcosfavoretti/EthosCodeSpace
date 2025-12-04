import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { EstruturaNeo4jDAO } from '../infra/dao/EstruturaNeo4j.dao';
import { ResEstruturaItemDTO } from '@app/modules/contracts/dto/ResEstruturaItem.dto';

@Injectable()
export class ListaEstruturasUsecase {
  constructor(
    @Inject(EstruturaNeo4jDAO) private estruturaNeo4jDAO: EstruturaNeo4jDAO,
  ) {}

  async listAll(): Promise<ResEstruturaItemDTO[]> {
    try {
      return await this.estruturaNeo4jDAO.listEstruturas();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('problemas com o serviço');
    }
  }
}
