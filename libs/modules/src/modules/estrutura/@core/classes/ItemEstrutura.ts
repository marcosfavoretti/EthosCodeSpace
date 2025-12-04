import { Partcode } from '@app/modules/shared/classes/Partcode';
import { Processos } from './Processos';

export class ItemEstrutura {
  constructor(
    public status: string,
    public partcode: Partcode,
    public itemCliente: string,
    public qtd: number,
  ) {}

  private _ehControle: boolean;

  setItemDeControle() {
    this._ehControle = true;
  }

  get ehControle() {
    return this._ehControle;
  }

  static createItem(props: {
    partcode: string | Partcode;
    itemCliente: string;
    qtd: number;
    status: string;
    ehControle: boolean;
  }) {
    const item = new ItemEstrutura(
      props.status,
      props.partcode instanceof Partcode
        ? props.partcode
        : new Partcode(props.partcode),
      props.itemCliente,
      props.qtd,
    );
    item.setItemDeControle();
    return item;
  }

  // get ehControle() {
  //     return this._ehControle;
  // }

  // get status() {
  //     return this._status;
  // }

  // get partcode() {
  //     return this._partcode;
  // }

  // get itemCliente() {
  //     return this._itemCliente;
  // }

  // get qtd() {
  //     return this._qtd
  // }
}
