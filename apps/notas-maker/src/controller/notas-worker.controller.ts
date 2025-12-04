import { GerarNotaUseCase } from '@app/modules/modules/notas/application/GerarNota.usecase';
import { BadRequestException, Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateNotaReqDTO } from '@app/modules/contracts/dto/CreateNotaReq.dto';
import { NOTA_CRIACAO } from '../@core/consts';
import { GerarNotaResDTO } from '@app/modules/contracts/dto/GerarNotaRes.dto';

@Controller()
export class NotaWorkerController {
  constructor(private readonly gerarNotaUseCase: GerarNotaUseCase) {}

  @MessagePattern({ cmd: NOTA_CRIACAO })
  async generatePdfChunk(
    @Payload() payload: CreateNotaReqDTO,
  ): Promise<GerarNotaResDTO> {
    try {
      Logger.log('chegou servico para mim');
      const result = await this.gerarNotaUseCase.execute(payload);
      return result;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error);
    }
  }
}
