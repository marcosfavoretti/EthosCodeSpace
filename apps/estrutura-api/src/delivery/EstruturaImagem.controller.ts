import { ConsultaPorPartcodeReqDTO } from '@app/modules/contracts/dto/ConsultaPorPartcodeReq.dto';
import { ImagemDaEstruturaUsecase } from '@app/modules/modules/estrutura/application/ImagemDaEstruturaUsecase';
import {
  Controller,
  Get,
  Inject,
  Query,
  Res,
  StreamableFile,
  Header,
} from '@nestjs/common';
import type { Response } from 'express';

@Controller('image')
export class EstruturaImagemController {
  @Inject(ImagemDaEstruturaUsecase)
  private imagemDaEstruturaUsecase: ImagemDaEstruturaUsecase;
  @Get('/')
  @Header('Content-Type', 'image/jpeg') // ou o tipo de imagem correto, como 'image/png'
  async getImagemDaEstruturaMethod(
    @Res() res: Response,
    @Query() dto: ConsultaPorPartcodeReqDTO,
  ): Promise<void> {
    console.log(dto);
    const buffer = await this.imagemDaEstruturaUsecase.getFile(
      dto.partcode.getPartcodeNum(),
    );
    res.send(buffer);
  }
}
