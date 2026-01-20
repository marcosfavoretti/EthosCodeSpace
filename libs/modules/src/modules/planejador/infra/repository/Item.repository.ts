import { DataSource, Repository } from 'typeorm';
import { ItemComCapabilidade } from '../../@core/entities/Item.entity';
import { InjectDataSource } from '@nestjs/typeorm';

export class ItemRepository extends Repository<ItemComCapabilidade> {
  constructor(@InjectDataSource('syneco_database') dt: DataSource) {
    super(ItemComCapabilidade, dt.createEntityManager());
  }
}
