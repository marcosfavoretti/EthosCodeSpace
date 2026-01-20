import { Fabrica } from '../entities/Fabrica.entity';
import { Pedido } from '../entities/Pedido.entity';
import { ItemEstruturado } from './ItemEstruturado';
import { PlanejamentoTemporario } from './PlanejamentoTemporario';

export type AlocacaoProps = {
  fabrica: Fabrica;
  pedido: Pedido;
  estrutura: ItemEstruturado;
  /**
   * @description planejamento fabril corrente na fabrica. Ele deve conter todos os planejamentos para serem validados
   */
  planejamentoFabril: PlanejamentoTemporario[];
  /**
   * @description serve para adicionar contexto de alguma planejamento que ja foi feito. Por exemplo para planejar as dependencias eu passo o planejamento base do Rops da estrutura
   */
  planBase?: PlanejamentoTemporario[];
};
