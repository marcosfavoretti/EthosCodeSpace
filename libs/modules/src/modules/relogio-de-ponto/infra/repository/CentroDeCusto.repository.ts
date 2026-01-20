import { Injectable } from '@nestjs/common';
import { CentroDeCusto } from '../../@core/entities/CentroDeCusto.entity';
import { Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class CentroDeCustoRepository extends Repository<CentroDeCusto> {
  constructor(
    @InjectDataSource('protheus')
    dataSource,
  ) {
    super(CentroDeCusto, dataSource.createEntityManager());
  }
}
