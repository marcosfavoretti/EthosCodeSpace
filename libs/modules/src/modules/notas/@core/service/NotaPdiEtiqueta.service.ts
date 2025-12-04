import { Inject, Injectable } from '@nestjs/common';
import { __NotaPdiEtiqueta } from '../consts/symbols';
import { IGeracaoNota, OutputFormats } from '../interface/IGeracaoNota';
import { ImageTemplateBuildService } from '../../infra/service/ImageTemplateBuild.service';
import type { ITemplateBuilder } from '../interface/ITemplateBuilder';
import { PdiLabelLoader } from '../../infra/service/PdiLabelLoader';
import type { ITemplateLoader } from '../interface/ITemplateLoader';
import { NotaPDIEtiqueta } from '../classes/NotaPdiEtiqueta';

@Injectable()
export class NotaPdiEtiquetaService implements IGeracaoNota {
  constructor(
    @Inject(ImageTemplateBuildService)
    private imgTemplateBuild: ITemplateBuilder,
    @Inject(PdiLabelLoader) private pdiLabelLoader: ITemplateLoader,
  ) {}

  identificador(): symbol {
    return __NotaPdiEtiqueta;
  }

  async gerar(nota: NotaPDIEtiqueta[]): Promise<{
    content: Buffer | string;
    mimeType: OutputFormats;
    fileName?: string;
  }> {
    const template = await this.pdiLabelLoader.load({
      data: nota,
    });
    const img = await this.imgTemplateBuild.builin({
      template,
      data: nota,
    });
    return {
      content: img,
      mimeType: 'image/png',
    };
  }
}
