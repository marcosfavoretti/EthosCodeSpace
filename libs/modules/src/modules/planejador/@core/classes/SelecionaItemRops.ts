import { ItemComCapabilidade } from '../entities/Item.entity';
import { ISelecionarItem } from '../interfaces/ISelecionarItem';
import { ItemEstruturado } from './ItemEstruturado';

export class SelecionaItemRops implements ISelecionarItem {
  seleciona(itens: ItemEstruturado): ItemComCapabilidade {
    return itens.itemRops;
  }
}
