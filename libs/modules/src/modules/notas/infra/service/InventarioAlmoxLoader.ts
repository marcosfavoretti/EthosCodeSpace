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
        fs.readFile(templatePath)
            .then(content => {
                this.handlebarsCompiled = Handlebars.compile(
                    content.toString()
                );
            })
            .catch(err => {
                Logger.error('Falha ao ler o template Handlebars', err, 'InventarioAlmoxLoader');
            });
    }

    /**
     * Método auxiliar privado para "fatiar" um array em pedaços menores.
     * @param array O array de entrada.
     * @param size O tamanho de cada "fatia".
     * @returns Um novo array contendo os arrays "fatiados".
     */
    private _chunkArray<T>(array: T[], size: number): T[][] {
        const result: T[][] = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }
        return result;
    }

    async load(props: { data: NotaInventarioAlmox[] }): Promise<string> {
        const { data } = props;

        // 1. Processa todas as notas para gerar QRCodes e Barcodes
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

        // Logger.debug(`Data para compilar ${JSON.stringify(processedData)}`);
        Logger.debug(`Total de itens processados: ${processedData.length}`, 'InventarioAlmoxLoader');

        // 2. *** LÓGICA DE FATIAMENTO (CHUNK) ***
        // O template HTML usa 'col-4', o que significa 3 colunas por linha.
        // Precisamos "fatiar" o array de dados em grupos de 3.
        const chunkSize = 3;
        const chunkedData = this._chunkArray(processedData, chunkSize);

        /*
        * 'chunkedData' agora terá a estrutura que o template espera:
        * [
        * [ item1, item2, item3 ],  <- Linha 1
        * [ item4, item5, item6 ],  <- Linha 2
        * [ item7, item8, item9 ],  <- Linha 3
        * [ item10 ]                 <- Linha 4
        * ]
        */

        // 3. Passa o array "fatiado" para o template Handlebars
        // Note que estamos passando 'chunkedData' diretamente como 'payload'
        const html = this.handlebarsCompiled({ payload: chunkedData });
        return html;
    }
}
