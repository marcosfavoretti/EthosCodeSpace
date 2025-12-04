import { BufferHistorico } from '../@core/entities/BufferHistorico.entity';
import { Inject } from '@nestjs/common';
import { GerenciaBuffersService } from '../infra/service/GerenciaBuffers.service';
import { SaveBufferLogDto } from '@app/modules/contracts/dto/SaveBufferLog.dto';

export class SaveBufferInHistUseCase {
  constructor(
    @Inject(GerenciaBuffersService)
    private gerenciaBufferService: GerenciaBuffersService,
  ) {}

  async saveHistorico(dto: SaveBufferLogDto): Promise<BufferHistorico> {
    try {
      const savedData = await this.gerenciaBufferService.consultaItemNoDia(
        dto.item,
        new Date(),
        dto.mercadoName,
      );
      savedData.buffer = dto.qtd;
      return (await this.gerenciaBufferService.salva(savedData))[0];
    } catch (error) {
      throw error;
    }
  }
}
