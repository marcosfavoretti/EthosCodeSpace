import { Fabrica } from '../entities/Fabrica.entity';
import { Planejamento } from '../entities/Planejamento.entity';

export interface IOnNovoPlanejamentos {
  execute(fabrica: Fabrica, planejamentos: Planejamento[]): Promise<void>;
}
export const IOnNovoPlanejamentos = Symbol('IOnNovoPlanejamentos');
