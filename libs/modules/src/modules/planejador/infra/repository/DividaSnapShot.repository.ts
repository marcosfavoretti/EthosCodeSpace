import { DataSource, Repository } from 'typeorm';
import { DividaSnapShot } from '../../@core/entities/DividaSnapShot.entity';
import { InjectDataSource } from '@nestjs/typeorm';

export class DividaSnapShotRepository extends Repository<DividaSnapShot> {
  constructor(@InjectDataSource('syneco_database') dt: DataSource) {
    super(DividaSnapShot, dt.createEntityManager());
  }
}
