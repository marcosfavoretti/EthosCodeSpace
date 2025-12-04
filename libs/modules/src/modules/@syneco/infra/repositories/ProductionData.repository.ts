import { DataSource, Repository } from 'typeorm';
import { ProductionData } from '../../@core/entities/ProductionData.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { IProductionDataRepository } from '../../@core/interfaces/IProductionDataRepository';

export class ProductionDataRepository
  extends Repository<ProductionData>
  implements IProductionDataRepository
{
  constructor(@InjectDataSource('syneco_database') dt: DataSource) {
    super(ProductionData, dt.createEntityManager());
  }
}
