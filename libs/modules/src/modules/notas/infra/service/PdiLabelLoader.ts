import { join } from 'path';
import { NotaPDIEtiqueta } from '../../@core/classes/NotaPdiEtiqueta';
import { ITemplateLoader } from '../../@core/interface/ITemplateLoader';
import * as fs from 'fs/promises';
import { Logger } from '@nestjs/common';
import Handlebars from 'handlebars';
import { generateDataMatrix } from '@app/modules/utils/datamatrix.wrapper';
import { ethos_logox64 } from '@app/modules/utils/ethos_logox64';

export class PdiLabelLoader implements ITemplateLoader {
  private handlebarsCompiled;

  constructor() {
    const templatePath = join(__dirname, 'templates', 'label.template.html');
    fs.readFile(templatePath)
      .then((content) => {
        this.handlebarsCompiled = Handlebars.compile(content.toString());
      })
      .catch((err) => {
        Logger.error(
          `Falha ao ler o template Handlebars ${templatePath}`,
          err,
          'InventarioAlmoxLoader',
        );
      });
  }

  async load(props: { data: NotaPDIEtiqueta[] }): Promise<string> {
    const { data } = props;
    const promises = data.map(async (d) => {
      const { x64 } = await generateDataMatrix({ data: d.getDataMatrixValue });
      d.set_datamatrixImageBase64 = x64;
      return d;
    });
    const etiquetasPdi = await Promise.all(promises);
    console.log(etiquetasPdi);
    const html = this.handlebarsCompiled({ ...etiquetasPdi[0], ethos_logox64 });
    return html as string;
  }
}
