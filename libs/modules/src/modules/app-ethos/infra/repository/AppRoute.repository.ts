import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AppRoute } from '../../@core/entities/AppRoute.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppRouteRepository extends Repository<AppRoute> {
  constructor(
    @InjectDataSource('mongo')
    private readonly dataSource: DataSource,
  ) {
    super(AppRoute, dataSource.createEntityManager());
  }
}
