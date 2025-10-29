import { Injectable, Logger } from "@nestjs/common";
import { ITemplateLoader } from "../../@core/interface/ITemplateLoader";
import Handlebars, { template } from "handlebars";
import { join } from "path";
import { NotaInventarioAlmox } from "../../@core/classes/NotaInventarioAlmox";
import * as fs from "node:fs/promises"
import { generateQrcode } from "@app/modules/utils/qrcode.wrapper";
import { generateBarcode } from "@app/modules/utils/barcode.wrapper";
@Injectable()
export class InventarioAlmoxLoader implements ITemplateLoader {

    private handlebarsCompiled;
    constructor() {
        const templatePath = join(__dirname, 'templates', 'template.inventario.html')
        Logger.log(`inventario template path ${templatePath}`);
        fs.readFile(templatePath)
            .then(content => {
                this.handlebarsCompiled = Handlebars.compile(
                    content.toString()
                );
            });
    }

    async load(props: { data: NotaInventarioAlmox[] }): Promise<string> {
        const { data } = props;

        const processingPromises = data.map(async (nota) => {
            const [{ x64: qr }, { x64: barcode1 }, { x64: barcode2 }] = await Promise.all([
                generateQrcode({ data: nota.cod_item }),
                generateBarcode({ data: nota.cod_item }),
                generateBarcode({ data: nota.cod_local_estoq })
            ]);
            nota.set_cod_item_qr = qr;
            nota.set_cod_item_barcode = barcode1;
            nota.set_cod_local_estoq_barcode = barcode2;

            return nota;
        });

        const processedData = await Promise.all(processingPromises);

        Logger.debug(`Data para compilar ${JSON.stringify(processedData)}`);

        const html = this.handlebarsCompiled({ payload: [processedData] });
        Logger.log(html);
        return html;
    }
}