import { ItemComCapabilidade } from "../entities/Item.entity";
import { ISelecionarItem } from "../interfaces/ISelecionarItem";
import { ItemEstruturado } from "./ItemEstruturado";

/**
 * @description retorna sempre a primeira dependencia. Logo se tiver porta e janela e a janela tiver no primeiro index, ela sera retornada
 */
export class SelecionaItemDep implements ISelecionarItem {
  seleciona(itens: ItemEstruturado): ItemComCapabilidade {
    return itens.itensDependencia[0];
  }
}
