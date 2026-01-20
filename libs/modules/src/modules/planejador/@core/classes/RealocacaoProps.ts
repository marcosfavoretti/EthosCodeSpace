import { Pedido } from "../entities/Pedido.entity";
import { PlanejamentoTemporario } from "./PlanejamentoTemporario";

/**
 * @description todos os itens do array tem que ser do mesmo pedido
 */
export class __RealocacaoProps {
  pedido: Pedido;
  novaData: Date;
  planejamentoPedido: PlanejamentoTemporario[];
  planejamentoFalho: PlanejamentoTemporario;
}
