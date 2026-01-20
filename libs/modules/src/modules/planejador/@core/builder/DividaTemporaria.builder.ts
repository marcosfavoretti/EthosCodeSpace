import { DividaTemporaria } from '../classes/DividaTemporaria';
import { ItemComCapabilidade } from '../entities/Item.entity';
import { Pedido } from '../entities/Pedido.entity';
import { Setor } from '../entities/Setor.entity';
import { CODIGOSETOR } from '../enum/CodigoSetor.enum';

export class DividaTemporariaBuilder {
  private _qtd: number;
  private _pedido: Pedido;
  private _setor: Setor;
  private _item: ItemComCapabilidade;

  qtd(qtd: number): DividaTemporariaBuilder {
    this._qtd = qtd;
    return this;
  }

  pedido(pedido: Pedido): DividaTemporariaBuilder {
    this._pedido = pedido;
    return this;
  }

  setor(setor: CODIGOSETOR): DividaTemporariaBuilder {
    this._setor = { codigo: setor, nome: '' }; //gambs
    return this;
  }

  item(item: ItemComCapabilidade): DividaTemporariaBuilder {
    this._item = item;
    return this;
  }

  build(): DividaTemporaria {
    const divida = new DividaTemporaria();
    divida.qtd = this._qtd;
    divida.pedido = this._pedido;
    divida.setor = this._setor;
    divida.item = this._item;
    return divida;
  }
}
