import { ItemComCapabilidade } from '../entities/Item.entity';
import { ISelecionarItem } from '../interfaces/ISelecionarItem';
import { ItemEstruturado } from './ItemEstruturado';

export class SelecionaItem000 implements ISelecionarItem {
  seleciona(item: ItemEstruturado): ItemComCapabilidade {
    return item.itemFinal;
  }
}
