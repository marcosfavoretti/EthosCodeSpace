import { PlanejamentoTemporario } from '../classes/PlanejamentoTemporario';

export interface IVerificaCapacidade {
  verificaCapacidade(qtd: number): boolean;
  calculaCapacidade(qtd: number): number;
  consumes(plan: PlanejamentoTemporario): boolean;
}
