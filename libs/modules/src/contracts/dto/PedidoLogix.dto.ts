import { ItemComCapabilidade } from '@app/modules/modules/planejador/@core/entities/Item.entity';
import { Pedido } from '@app/modules/modules/planejador/@core/entities/Pedido.entity';

export class PedidoLogixDTO {
  codigo: string;

  identificador: string;

  dataEntrega: Date;

  lote: number;

  item: string;

  static toDomainEntity(pedidoLogix: PedidoLogixDTO): Partial<Pedido> {
    const pedido = new Pedido(
      pedidoLogix.codigo,
      pedidoLogix.dataEntrega,
      { Item: pedidoLogix.item } as unknown as ItemComCapabilidade,
      pedidoLogix.lote,
      false,
      pedidoLogix.identificador,
    );
    return pedido;
  }
}
