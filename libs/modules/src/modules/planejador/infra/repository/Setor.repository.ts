import { DataSource, Repository } from 'typeorm';
import { Setor } from '../../@core/entities/Setor.entity';
import { InjectDataSource } from '@nestjs/typeorm';

export class SetorRepository extends Repository<Setor> {
  constructor(@InjectDataSource('syneco_database') dt: DataSource) {
    super(Setor, dt.createEntityManager());
  }
}
