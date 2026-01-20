import { ItemComCapabilidade } from "../entities/Item.entity";
import { Pedido } from "../entities/Pedido.entity";
import { Setor } from "../entities/Setor.entity";

export class DividaTemporaria {
  dividaId?: number;

  qtd: number;

  pedido: Pedido;

  setor: Setor;

  item: ItemComCapabilidade;

  createdAt: Date;
}
