import { DataSource, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { ItemXQtdSemanaComBuffer } from '../../@core/entities/ItemQtdSemana.entity';

export class ItemQtdSemanaComBufferRepository extends Repository<ItemXQtdSemanaComBuffer> {
  constructor(@InjectDataSource('syneco_database') dt: DataSource) {
    super(ItemXQtdSemanaComBuffer, dt.createEntityManager());
  }
}
