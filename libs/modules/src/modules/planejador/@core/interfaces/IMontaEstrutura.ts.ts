import { ItemEstruturado } from '../classes/ItemEstruturado';
import { ItemComCapabilidade } from '../entities/Item.entity';

export interface IMontaEstrutura {
  monteEstrutura(item: ItemComCapabilidade): Promise<ItemEstruturado>;
}

export const IMontaEstrutura = Symbol('IMontaEstrutura');
