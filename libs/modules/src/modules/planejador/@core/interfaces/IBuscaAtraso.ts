import { Fabrica } from '../entities/Fabrica.entity';
import { Pedido } from '../entities/Pedido.entity';
import { PlanejamentoSnapShot } from '../entities/PlanejamentoSnapShot.entity';

export const IBuscaAtraso = Symbol('IBuscaAtraso');
export interface IBuscaAtraso {
  buscaAtraso(
    fabrica: Fabrica,
    pedidos: Pedido[],
  ): Promise<PlanejamentoSnapShot[]>;
}
