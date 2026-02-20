import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Veiculo } from '../../@core/entity/Veiculo.entity';
import { IVeiculoRepository } from '../../@core/interface/IVeiculo.repository';

@Injectable()
export class VeiculoRepository
  extends Repository<Veiculo>
  implements IVeiculoRepository {

  constructor(
    @InjectDataSource('mongo')
    private dt: DataSource
  ) {
    super(Veiculo, dt.createEntityManager());
  }

  async findLatestByPlaca(placa: string): Promise<Veiculo | null> {
    return this.findOne({
      where: { placa },
      order: { createdAt: 'DESC' }, // Order by creation date to get the latest
    });
  }

}
