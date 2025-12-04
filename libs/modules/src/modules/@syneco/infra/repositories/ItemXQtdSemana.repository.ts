import { DataSource, Repository } from 'typeorm';
import { ItemXQtdSemana } from '../../@core/entities/ItemXQtdSemana.entity';
import { InjectDataSource } from '@nestjs/typeorm';

export class ItemXQtdSemanaRepository extends Repository<ItemXQtdSemana> {
  constructor(@InjectDataSource('syneco_database') dt: DataSource) {
    super(ItemXQtdSemana, dt.createEntityManager());
  }
}
