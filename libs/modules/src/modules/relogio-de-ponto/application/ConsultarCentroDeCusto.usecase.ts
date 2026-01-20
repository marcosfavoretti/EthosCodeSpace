import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CentroDeCustoRepository } from '../infra/repository/CentroDeCusto.repository';
import { CentroDeCusto } from '../@core/entities/CentroDeCusto.entity';
import { ResCentroDeCustoDTO } from '@app/modules/contracts/dto/ResCentroDeCusto.dto';
import { Raw } from 'typeorm';

@Injectable()
export class ConsultarCentrodeCustoUseCase {
  constructor(private ccRepository: CentroDeCustoRepository) {}
  async consultar(): Promise<ResCentroDeCustoDTO[]> {
    try {
      //pega os codigo cc de 4 digitos apenas em oracle sendo que o alias é um number ex 9122 deix mas 21231 nao deixa
      const ccs = await this.ccRepository.find({
        where: {
          codigoCC: Raw((alias) => `LENGTH(TRIM(${alias})) = 4`),
        },
      });
      return ccs.map((cc) => ResCentroDeCustoDTO.fromEntity(cc));
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        'Erro ao consultar centros de custo.',
      );
    }
  }
}
