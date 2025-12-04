import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Funcionario } from '../../@core/entities/Funcionarios.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FuncinarioRepository extends Repository<Funcionario> {
  constructor(
    @InjectDataSource('protheus')
    private dt: DataSource,
  ) {
    super(Funcionario, dt.createEntityManager());
  }
}
