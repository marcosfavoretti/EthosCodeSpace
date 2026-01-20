import { ItemEstruturado } from '../classes/ItemEstruturado';
import { ItemComCapabilidade } from '../entities/Item.entity';

export interface ISelecionarItem {
  seleciona(itens: ItemEstruturado): ItemComCapabilidade;
}
export const ISelecionarItem = Symbol('ISelecionarItem');
