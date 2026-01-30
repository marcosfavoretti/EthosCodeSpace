import { BufferHistorico } from '../@core/entities/BufferHistorico.entity';
import { Inject } from '@nestjs/common';
import { GerenciaBuffersService } from '../infra/service/GerenciaBuffers.service';
import { SaveBufferLogDto } from '@app/modules/contracts/dto/SaveBufferLog.dto';
import { ResBufferHistoricoDto } from '@app/modules/contracts/dto/ResBufferHistorico.dto';

export class SaveBufferInHistUseCase {
  constructor(
    @Inject(GerenciaBuffersService)
    private gerenciaBufferService: GerenciaBuffersService,
  ) {}

  async saveHistorico(dto: SaveBufferLogDto): Promise<ResBufferHistoricoDto> {
    try {
      const savedData = await this.gerenciaBufferService.consultaItemNoDia(
        dto.item,
        new Date(),
        dto.mercadoName,
      );
      savedData.buffer = dto.qtd;
      const entity = (await this.gerenciaBufferService.salva(savedData))[0];

      // Mapeamento para DTO de resposta
      return {
        id: entity.id,
        serverTime: entity.serverTime,
        buffer: entity.buffer,
        itemId: entity.item?.Item, // Assumindo relação carregada ou existente
      };
    } catch (error) {
      throw error;
    }
  }
}
