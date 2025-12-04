import { Inject, Injectable, Logger } from '@nestjs/common';
import { IGeracaoNota, OutputFormats } from '../interface/IGeracaoNota';
import { NotaInventarioAlmox } from '../classes/NotaInventarioAlmox';
import type { ITemplateBuilder } from '../interface/ITemplateBuilder';
import type { ITemplateLoader } from '../interface/ITemplateLoader';
import { PdfTemplateBuild } from '../../infra/service/PdfTemplateBuild';
import { InventarioAlmoxLoader } from '../../infra/service/InventarioAlmoxLoader';
import { __InventarioAlmox } from '../consts/symbols';

@Injectable()
export class InventarioAlmoxService implements IGeracaoNota {
  identificador(): string | symbol {
    return __InventarioAlmox;
  }

  constructor(
    @Inject(PdfTemplateBuild) private templatebuilder: ITemplateBuilder,
    @Inject(InventarioAlmoxLoader) private templateLoader: ITemplateLoader,
  ) {}

  async gerar(nota: NotaInventarioAlmox[]): Promise<{
    content: Buffer | string;
    mimeType: OutputFormats;
    fileName?: string;
  }> {
    //estrategia para criar nota
    if (!nota.every((nt) => nt instanceof NotaInventarioAlmox))
      throw Error('nota com parâmetros incorretos');

    /**
     * executa para geracao do template ja com dados
     */
    const template = await this.templateLoader.load({
      data: nota,
    });

    const templateFinal = await this.templatebuilder.builin({
      data: nota,
      template: template,
    });

    // --- Processo de Salvamento Melhorado ---

    // // 1. Use o diretório temporário do sistema, não o __dirname
    // //    (Melhor ainda: injete um 'storage_path' via ConfigService)
    // const tempDir = path.join(os.tmpdir(), 'app-notas');
    // const fileName = `inventario-${randomUUID()}.pdf`;
    // const filepath = path.join(tempDir, fileName);

    // try {
    //     await fs.mkdir(tempDir, { recursive: true });
    //     await fs.writeFile(filepath, templateFinal);
    //     Logger.log(`Arquivo temporário salvo em: ${filepath}`);
    // } catch (error) {
    //     Logger.error('Falha ao salvar PDF temporário', error.stack);
    //     throw new Error(`Não foi possível salvar o arquivo: ${error.message}`);
    // }

    return {
      content: templateFinal,
      mimeType: 'application/pdf',
    };
  }
}
