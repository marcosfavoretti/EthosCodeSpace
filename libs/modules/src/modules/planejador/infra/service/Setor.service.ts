import { Setor } from '../../@core/entities/Setor.entity';
import { Inject } from '@nestjs/common';
import { SetorRepository } from '../repository/Setor.repository';
import { CODIGOSETOR } from '../../@core/enum/CodigoSetor.enum';

export class SetorService {
  constructor(
    @Inject(SetorRepository) private setorRepository: SetorRepository,
  ) {}

  async consultarSetores(): Promise<Setor[]> {
    return await this.setorRepository.find();
  }

  async consultarSetor(codigo: CODIGOSETOR): Promise<Setor> {
    return await this.setorRepository.findOneOrFail({
      where: {
        codigo: codigo,
      },
    });
  }
}
