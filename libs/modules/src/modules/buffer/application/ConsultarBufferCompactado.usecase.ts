import { CompactBuffer } from '../@core/class/CompactBuffer';
import { Inject, InternalServerErrorException } from '@nestjs/common';
import { CompactBufferDataService } from '../infra/service/CompactBufferData.service';
import { ConsultarBufferCompactadoDTO } from '@app/modules/contracts/dto/ConsultarBufferHistorico.dto';

export class ConsultarBufferCompactadoUseCase {
  constructor(
    @Inject(CompactBufferDataService)
    private compactbuffer: CompactBufferDataService,
  ) {}
  async consultar(dto: ConsultarBufferCompactadoDTO): Promise<CompactBuffer[]> {
    try {
      const response = await this.compactbuffer.compact(
        dto.startDate,
        dto.endDate,
      );
      return response.map(
        (item) =>
          ({
            ...item,
            serverTime: item.serverTime.toDateString(),
          }) as CompactBuffer,
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
