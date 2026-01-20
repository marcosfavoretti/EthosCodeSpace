import { PlanejamentoTemporario } from '../classes/PlanejamentoTemporario';
import { Fabrica } from '../entities/Fabrica.entity';
import { Pedido } from '../entities/Pedido.entity';
import { Planejamento } from '../entities/Planejamento.entity';
import { PlanejamentoSnapShot } from '../entities/PlanejamentoSnapShot.entity';

export interface IGerenciadorPlanejamentoMutation {
  appendPlanejamento(
    fabrica: Fabrica,
    pedido: Pedido,
    planejamentos: PlanejamentoTemporario[],
  ): Promise<Planejamento[]>;
  appendReplanejamento(
    fabrica: Fabrica,
    pedido: Pedido,
    planejamentosOriginais: PlanejamentoSnapShot[],
    planejamentosNovos: PlanejamentoTemporario[],
  ): Promise<Planejamento[]>;
  removePlanejamento(
    fabrica: Fabrica,
    planejamento: PlanejamentoSnapShot[],
  ): Promise<void>;
}

export const IGerenciadorPlanejamentoMutation = Symbol(
  'IGerenciadorPlanejamentoMutation',
);
