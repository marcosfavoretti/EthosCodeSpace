import { Inject } from '@nestjs/common';
import { In } from 'typeorm';
import { PlanejamentoRepository } from '../repository/Planejamento.repository';
import { Planejamento } from '../../@core/entities/Planejamento.entity';

export class PlanejamentoService {
  constructor(
    @Inject(PlanejamentoRepository)
    private planejamentoRepository: PlanejamentoRepository,
  ) {}

  async consultaPlanejamento(planejamentoId: number): Promise<Planejamento> {
    return await this.planejamentoRepository.findOneOrFail({
      where: {
        planejamentoId: planejamentoId,
      },
    });
  }
  async consultaPlanejamentos(
    planejamentoId: number[],
  ): Promise<Planejamento[]> {
    return await this.planejamentoRepository.find({
      where: {
        planejamentoId: In(planejamentoId),
      },
    });
  }
}
