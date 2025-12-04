import { DataSource, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { LabelPDI } from '../../@core/entities/LabelPDI.entity';

export class LabelPDIRepository extends Repository<LabelPDI> {
  constructor(@InjectDataSource('syneco_database') dt: DataSource) {
    super(LabelPDI, dt.createEntityManager());
  }
}
