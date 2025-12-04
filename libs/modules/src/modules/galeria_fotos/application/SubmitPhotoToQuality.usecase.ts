import { Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'node:fs';
import * as path from 'path';
import { CreatePerguntaParaQualidadeDTO } from '@app/modules/contracts/dto/CreatePerguntaParaQualidade.dto';
import { ReportQualidadeService } from '../infra/service/ReportQualidade.service';
import { ConfigService } from '@nestjs/config';
import { IStorageService } from '../../storage/@core/interfaces/IStorage.service';
import { ReportQualidade } from '../@core/entities/PerguntaParaQualidade.entity';

export class SubmitPhotoToQualityUsecase {
  private fotoPath: string;
  private videoPath: string;

  constructor(
    @Inject(ConfigService)
    private configService: ConfigService,
    @Inject(IStorageService)
    private storageService: IStorageService,
    @Inject(ReportQualidadeService)
    private perguntaService: ReportQualidadeService,
  ) {
    const videopath = this.configService.get<string>('REPORT_VIDEO_PATH');
    const fotopath = this.configService.get<string>('REPORT_PHOTO_PATH');
    if (!videopath || !fotopath)
      throw new Error('nao foi localizado o repositorio de video ou de imagem');
    this.videoPath = videopath;
    this.fotoPath = fotopath;
  }

  async create(
    dto: CreatePerguntaParaQualidadeDTO,
    imagens: Array<Express.Multer.File>,
  ): Promise<ReportQualidade> {
    const imagensPromises = imagens.map(async (img) => {
      const { codItem, nSerie } = dto;
      const randomSuffix = uuidv4().slice(0, 4);
      const ext = path.extname(img.originalname);
      const fileName = `${codItem}__${nSerie}__${randomSuffix}${ext}`;
      await this.storageService.save(
        ext === 'mp4' ? this.videoPath : this.fotoPath,
        fileName,
        img.buffer,
      );
    });
    await Promise.all(imagensPromises);
    return await this.perguntaService.create(dto, imagens);
  }
}
