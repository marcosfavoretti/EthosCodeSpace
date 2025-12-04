import { Inject, Injectable } from '@nestjs/common';
import { EstruturaNeo4jDAO } from '../infra/dao/EstruturaNeo4j.dao';
import { Partcode } from '@app/modules/shared/classes/Partcode';

@Injectable()
export class RemoveEstruturaUsecase {
  constructor(
    @Inject(EstruturaNeo4jDAO) private estructRepository: EstruturaNeo4jDAO,
  ) {}
  async remove(partcode: Partcode): Promise<void> {
    await this.estructRepository.deleteEstrutura(partcode);
  }
}
