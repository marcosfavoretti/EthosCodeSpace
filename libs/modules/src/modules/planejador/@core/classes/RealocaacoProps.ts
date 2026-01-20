import { Fabrica } from '../entities/Fabrica.entity';
import { Pedido } from '../entities/Pedido.entity';
import { ItemEstruturado } from './ItemEstruturado';
import { PlanejamentoTemporario } from './PlanejamentoTemporario';
import { RealocacaoParcial } from './RealocacaoParcial';

export type RealocacaoProps = {
  fabrica: Fabrica;
  pedido: Pedido;
  estrutura: ItemEstruturado;
  planFalho: PlanejamentoTemporario;
  novoDia: Date;
  planDoPedido: PlanejamentoTemporario[];
  planejamentoFabril: PlanejamentoTemporario[];
  realocacaoUltSetor?: RealocacaoParcial;
};
