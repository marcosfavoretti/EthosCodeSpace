import { Inject } from '@nestjs/common';
import { ConsultaSetoresService } from '../infra/service/ConsultaSetores.service';
import { ResSetorDTO } from '@app/modules/contracts/dto/ResSetores.dto';

export class ConsultaSetoresUseCase {
  constructor(
    @Inject(ConsultaSetoresService)
    private setoresService: ConsultaSetoresService,
  ) {}
  async consultaTodos(): Promise<ResSetorDTO[]> {
    try {
      return this.setoresService.consultarSetores();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
