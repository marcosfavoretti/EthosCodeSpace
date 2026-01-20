import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppRouteRepository } from '../infra/repository/AppRoute.repository';
import { ConsultaPorIdDto } from '@app/modules/contracts/dto/ConsultaPorId.dto';

@Injectable()
export class DeletaRotaUseCase {
  constructor(
    @InjectRepository(AppRouteRepository)
    private readonly appRouteRepository: AppRouteRepository,
  ) {}

  async execute(input: ConsultaPorIdDto): Promise<void> {
    try {
      const { id } = input;
      const result = await this.appRouteRepository.delete(id);

      if (result.affected === 0) {
        throw new NotFoundException(`Rota com id ${id} não encontrada`);
      }
    } catch (error) {
      Logger.error(error, DeletaRotaUseCase.name);
      throw new InternalServerErrorException('Erro ao deletar a rota');
    }
  }
}
