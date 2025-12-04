import { Exclude } from 'class-transformer';
import { Partcode } from '@app/modules/shared/classes/Partcode';
import { ItemEstrutura } from './ItemEstrutura';

export class ItemEstruturaTree extends ItemEstrutura {
  private _children: ItemEstruturaTree[] = [];
  private _father: ItemEstrutura;

  private constructor(
    ehControle: boolean,
    status: string,
    partcode: Partcode,
    itemCliente: string,
    qtd: number,
    children: ItemEstruturaTree[] = [],
    _father?: ItemEstrutura,
  ) {
    super(status, partcode, itemCliente, qtd);
    this._children = children;
    _father &&
      (this._father = ItemEstrutura.createItem({
        ehControle: _father?.ehControle ?? false,
        itemCliente: _father?.itemCliente,
        partcode: _father?.partcode,
        status: _father?.status,
        qtd: _father?.qtd,
      }));
    ehControle && this.setItemDeControle();
  }

  @Exclude()
  get father() {
    return this._father;
  }

  addChildren(...children: ItemEstruturaTree[]) {
    this._children.push(...children);
  }

  static createItem(props: {
    partcode: string | Partcode;
    itemCliente: string;
    qtd: number;
    status: string;
    ehControle: boolean;
    children?: ItemEstruturaTree[];
    father?: ItemEstrutura;
  }): ItemEstruturaTree {
    const item = new ItemEstruturaTree(
      props.ehControle,
      props.status,
      props.partcode instanceof Partcode
        ? props.partcode
        : new Partcode(props.partcode),
      props.itemCliente,
      props.qtd,
      props.children,
      props.father,
    );
    return item;
  }

  get children(): ItemEstruturaTree[] {
    return [...this._children];
  }

  addChild(child: ItemEstruturaTree): void {
    this._children.push(child);
  }
}
