import { ItemComCapabilidade } from '../entities/Item.entity';

export interface IBuscarItemDependecias {
  /**
   *
   * @param item
   * @description o ultimo item sempre sera o rops
   */
  buscar(item: ItemComCapabilidade): Promise<ItemComCapabilidade[]>;
}
export const IBuscarItemDependecias = Symbol('IBuscarItemDependecias');
