import { DataSource, Repository } from 'typeorm';
import { Pedido } from '../../@core/entities/Pedido.entity';
import { InjectDataSource } from '@nestjs/typeorm';

export class PedidoRepository extends Repository<Pedido> {
  constructor(@InjectDataSource('syneco_database') dt: DataSource) {
    super(Pedido, dt.createEntityManager());
  }
}
