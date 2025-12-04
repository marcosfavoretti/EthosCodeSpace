export const IEstaNaEstrutura = Symbol('IEstaNaEstrutura');
export interface IEstaNaEstrutura {
  verificaNaEstrutura(estrutura: string, partcode: string[]): Promise<boolean>;
}
