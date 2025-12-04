import { CreateNotaReqDTO } from '@app/modules/contracts/dto/CreateNotaReq.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { NotaPayloadFactory } from '../@core/service/NotaPayloadFactory';
import { NotaServiceFactory } from '../@core/service/NotaServiceFactory';
import { GerarNotaResDTO } from '@app/modules/contracts/dto/GerarNotaRes.dto';

@Injectable()
export class GerarNotaUseCase {
  constructor(
    private notaServiceFabrica: NotaServiceFactory,
    private notaPayloadFabrica: NotaPayloadFactory,
  ) {}

  async execute(dto: CreateNotaReqDTO): Promise<GerarNotaResDTO> {
    try {
      const { payload, tipo } = dto;
      const nota = await this.notaPayloadFabrica.create({
        payload,
        tipo,
      });
      const notaStrategy = this.notaServiceFabrica.buildNota({
        identificador: nota[0].type,
      });
      const { content, fileName, mimeType } = await notaStrategy.gerar(nota);
      return {
        content: content as Buffer,
        fileName,
        mimeType,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
