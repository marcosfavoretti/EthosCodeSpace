import { Inject } from '@nestjs/common';
import { SetoresRepository } from '../repository/Setores.repository';
import { Setores } from '../../@core/entities/Setores.entity';

export class ConsultaSetoresService {
  constructor(
    @Inject(SetoresRepository) private setoresRepo: SetoresRepository,
  ) {}

  async consultarSetores(): Promise<Setores[]> {
    try {
      return await this.setoresRepo.find();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
