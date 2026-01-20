import { Inject } from '@nestjs/common';
import { IValidaPlanejamento } from '../interfaces/IValidaPlanejamento';
import { Fabrica } from '../entities/Fabrica.entity';
import { ValidadorPlanejamento } from '../../ValidaPlenejamento.provider';
import { PlanejamentoTemporario } from '../classes/PlanejamentoTemporario';
import { Pedido } from '../entities/Pedido.entity';

export class PlanejamentoValidatorExecutorService {
  constructor(
    @Inject(ValidadorPlanejamento) private validator: IValidaPlanejamento[],
  ) {}

  async execute(
    fabrica: Fabrica,
    pedido: Pedido,
    planejamentoTemp: PlanejamentoTemporario[],
  ): Promise<void> {
    for (const validacaoPlanejado of this.validator) {
      await validacaoPlanejado.valide(fabrica, pedido, planejamentoTemp);
    }
  }
}
