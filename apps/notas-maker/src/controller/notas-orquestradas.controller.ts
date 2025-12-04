import { CreateInventarioNotaReqDTO } from '@app/modules/contracts/dto/CreateInventarioNotaReq.dto';
import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PDFDocument } from 'pdf-lib';
import { firstValueFrom } from 'rxjs';
import type { Response } from 'express';
import { __NOTAS_QUEUE } from '../@core/symbols';
import { NOTA_CRIACAO } from '../@core/consts';
import { CreateNotaReqDTO } from '@app/modules/contracts/dto/CreateNotaReq.dto';
import { GerarNotaResDTO } from '@app/modules/contracts/dto/GerarNotaRes.dto';
import { randomUUID } from 'node:crypto';
import { ApiOperation } from '@nestjs/swagger';
import {
  __InventarioAlmox,
  __NotaAlmox,
  __NotaPdiEtiqueta,
} from '@app/modules/modules/notas/@core/consts/symbols';
import { OutputFormats } from '@app/modules/modules/notas/@core/interface/IGeracaoNota';

@Controller('notas')
export class NotasOrquestradasController {
  constructor(@Inject(__NOTAS_QUEUE) private readonly client: ClientProxy) {}

  @ApiOperation({
    summary: `Cria os seguintes tipos de notas : ${[__NotaAlmox.toString(), __NotaPdiEtiqueta.toString(), __InventarioAlmox.toString()].join(', ')}`,
  })
  @Post('sync')
  async generatePdf(
    @Body() body: CreateNotaReqDTO,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const { payload, tipo } = body;

      const chunkSize = 9;
      const chunks: CreateInventarioNotaReqDTO[][] = [];

      for (let i = 0; i < payload.length; i += chunkSize) {
        chunks.push(payload.slice(i, i + chunkSize));
      }

      const pdfsResponse = await Promise.all(
        chunks.map((chunk) =>
          firstValueFrom(
            this.client.send<GerarNotaResDTO, CreateNotaReqDTO>(
              { cmd: NOTA_CRIACAO },
              {
                payload: chunk,
                tipo: tipo,
              },
            ),
          ),
        ),
      );

      let responseBytes;
      switch (pdfsResponse[0].mimeType as OutputFormats) {
        case 'application/pdf':
          const mergedPdf = await PDFDocument.create();
          for (const pdfPayload of pdfsResponse) {
            const pdf = await PDFDocument.load(Buffer.from(pdfPayload.content));
            const copiedPages = await mergedPdf.copyPages(
              pdf,
              pdf.getPageIndices(),
            );
            copiedPages.forEach((page) => mergedPdf.addPage(page));
          }
          responseBytes = await mergedPdf.save();
          break;
        case 'image/png':
          responseBytes = pdfsResponse[0].content;
        default:
          break;
      }

      res.setHeader('Content-Type', pdfsResponse[0].mimeType);
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${randomUUID()}`,
      );
      res.send(Buffer.from(responseBytes));
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
