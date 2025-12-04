import { DataSource, Repository } from 'typeorm';
import { TipoMarcacaoPonto } from '../../@core/entities/TipoMarcacaoPonto.entity';
import { InjectDataSource } from '@nestjs/typeorm';

export class TipoMarcacaoPontoRepository extends Repository<TipoMarcacaoPonto> {
  constructor(@InjectDataSource('logix') dt: DataSource) {
    super(TipoMarcacaoPonto, dt.createEntityManager());
  }
}
