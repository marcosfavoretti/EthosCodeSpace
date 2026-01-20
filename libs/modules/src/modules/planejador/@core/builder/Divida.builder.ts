import { Divida } from '../entities/Divida.entity';
import { ItemComCapabilidade } from '../entities/Item.entity';
import { Pedido } from '../entities/Pedido.entity';
import { Setor } from '../entities/Setor.entity';
import { CODIGOSETOR } from '../enum/CodigoSetor.enum';

export class DividaBuilder {
  private _qtd: number;
  private _pedido: Pedido;
  private _setor: Setor;
  private _item: ItemComCapabilidade;

  qtd(qtd: number): DividaBuilder {
    this._qtd = qtd;
    return this;
  }

  pedido(pedido: Pedido): DividaBuilder {
    this._pedido = pedido;
    return this;
  }

  setor(setor: CODIGOSETOR): DividaBuilder {
    this._setor = { codigo: setor, nome: '' }; //gambs
    return this;
  }

  item(item: ItemComCapabilidade): DividaBuilder {
    this._item = item;
    return this;
  }

  build(): Divida {
    const divida = new Divida();
    divida.qtd = this._qtd;
    divida.pedido = this._pedido;
    divida.setor = this._setor;
    divida.item = this._item;
    return divida;
  }
}
