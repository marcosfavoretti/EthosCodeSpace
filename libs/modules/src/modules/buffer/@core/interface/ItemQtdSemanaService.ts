export interface IItemQtdSemanaService {
  changeBuffer({ item, qtd }: { item: string; qtd: number }): Promise<void>;
}
export const IItemQtdSemanaService = Symbol('IItemQtdSemanaService');
