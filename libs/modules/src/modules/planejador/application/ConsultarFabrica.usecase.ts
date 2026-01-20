import { Inject, InternalServerErrorException } from '@nestjs/common';
import { FabricaService } from '../infra/service/Fabrica.service';
import { ConsutlarFabricaDTO } from '@app/modules/contracts/dto/ConsultarFabrica.dto';
import { FabricaResponseDto } from '@app/modules/contracts/dto/FabricaResponse.dto';

export class ConsultarFabricaUseCase {
  constructor(@Inject(FabricaService) private fabricaService: FabricaService) {}

  async consultar(dto: ConsutlarFabricaDTO): Promise<FabricaResponseDto> {
    try {
      const fabricaAlvo = await this.fabricaService.consultaFabrica(
        dto.fabricaId,
      );
      return FabricaResponseDto.fromEntity(fabricaAlvo);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
