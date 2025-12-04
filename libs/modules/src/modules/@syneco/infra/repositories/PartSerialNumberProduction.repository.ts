import { DataSource, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { PartSerialNumberProduction } from '../../@core/entities/PartSerialNumberProduction.entity';

export class PartSerialNumberProductionRepository extends Repository<PartSerialNumberProduction> {
  constructor(@InjectDataSource('syneco_database') dt: DataSource) {
    super(PartSerialNumberProduction, dt.createEntityManager());
  }
}
