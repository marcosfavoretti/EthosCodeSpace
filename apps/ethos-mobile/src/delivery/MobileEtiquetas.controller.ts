import { CreateNotaPdiEtiquetaDTO } from '@app/modules/contracts/dto/CreateNotaPdiEtiqueta.dto';
import { EtiquetaPdiUseCase } from '@app/modules/modules/etiquetas/application/EtiquetaPdi.usecase';
import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { Response } from 'express';

@Controller('/etiqueta')
export class MobileEtiquetasController {
  @Inject(EtiquetaPdiUseCase) private etiquetaPdiUseCase: EtiquetaPdiUseCase;
  @Post('/pdi')
  async etiquetaCreateMethod(
    @Body() payload: CreateNotaPdiEtiquetaDTO,
    @Res() res: Response,
  ): Promise<void> {
    const { content, mimeType, fileName } =
      await this.etiquetaPdiUseCase.make(payload);
    res.setHeader('Content-Type', mimeType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${fileName ?? randomUUID()}`,
    );
    res.send(content);
  }
  // @Post('/cat')
}
