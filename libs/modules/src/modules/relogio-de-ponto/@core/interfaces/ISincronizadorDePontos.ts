import { ArquivoPontoDado } from '../class/ArquivoPontoDado.entity';

export const ISincronizador = Symbol('ISincronizador');
export interface ISincronizadorDePontos {
  sincroniza(): Promise<ArquivoPontoDado[]>;
}
