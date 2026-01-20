import { Fabrica } from '../entities/Fabrica.entity';
import { DividaTemporaria } from '../classes/DividaTemporaria';
import { PlanejamentoTemporario } from '../classes/PlanejamentoTemporario';
import { Pedido } from '../entities/Pedido.entity';

export const ICalculoDivida = Symbol('ICalculoDivida');

export type CalculaDividaDoPlanejamentoProps = {
  fabrica: Fabrica;
  pedido: Pedido;
  planejamentos: PlanejamentoTemporario[];
};

/**
 * para forcar o decrecimo de uma divida retorne um divida de valor negativo
 */
export interface ICalculoDivida {
  calc(
    props: CalculaDividaDoPlanejamentoProps,
  ): Promise<DividaTemporaria[]> | DividaTemporaria[];
}
