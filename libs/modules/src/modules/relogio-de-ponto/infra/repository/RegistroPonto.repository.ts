import { DataSource, Repository } from 'typeorm';
import { RegistroPonto } from '../../@core/entities/RegistroPonto.entity';
import { InjectDataSource } from '@nestjs/typeorm';

export class RegistroPontoRepository extends Repository<RegistroPonto> {
  constructor(
    @InjectDataSource('logix')
    private dt: DataSource,
  ) {
    super(RegistroPonto, dt.createEntityManager());
  }
}
