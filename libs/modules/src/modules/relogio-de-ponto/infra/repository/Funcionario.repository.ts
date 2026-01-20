import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, In, Not, Raw, Repository } from 'typeorm';
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

  buscarPoridentificador(identificador: string[]): Promise<Funcionario[]> {
    return this.find({
      where: [
        {
          pis: Raw((alias) => `TRIM(${alias}) IN (:...pis)`, {
            pis: identificador,
          }), //In(identificadorUnico)
          demitido: Not('D'),
        },
        {
          cic: Raw((alias) => `TRIM(${alias}) IN (:...cpf)`, {
            cpf: identificador,
          }), //In(identificadorUnico)
          demitido: Not('D'),
        },
        {
          matricula: Raw((alias) => `TRIM(${alias}) IN (:...matricula)`, {
            matricula: identificador,
          }),
          demitido: Not('D'),
        },
      ],
    });
  }
}
