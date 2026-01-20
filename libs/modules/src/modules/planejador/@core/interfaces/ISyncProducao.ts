import { Setor } from '../entities/Setor.entity';

export interface ISyncProducao {
  // syncProducao(setor: Setor, date: Date): Mercado | Promise<Mercado>;
}

export const ISyncProducao = Symbol('ISyncProducao');
