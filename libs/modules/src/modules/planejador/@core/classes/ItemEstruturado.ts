import { ItemComCapabilidade } from "../entities/Item.entity";

export class ItemEstruturado {
  itemFinal: ItemComCapabilidade;
  itemRops: ItemComCapabilidade;
  itensDependencia: ItemComCapabilidade[];

  /**
   *
   * @param item
   * @description jogo para primeira colocacao do array o item requisitado
   */
  ordenaDependencias(item: ItemComCapabilidade): void {
    console.log('vou ordenar', item);
    const index = this.itensDependencia.findIndex((dep) => dep === item);
    if (index > -1) {
      const [found] = this.itensDependencia.splice(index, 1);
      this.itensDependencia.unshift(found);
    }
  }

  itensAsList(): ItemComCapabilidade[] {
    return [this.itemFinal, this.itemRops, ...this.itensDependencia];
  }
}
