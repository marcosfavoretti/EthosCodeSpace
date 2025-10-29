import { Inject, Injectable } from "@nestjs/common";
import { IGeracaoNota, OutputFormats } from "../interface/IGeracaoNota";
import { NotaAlmox } from "../classes/NotaAlmox";
import type { ITemplateBuilder } from "../interface/ITemplateBuilder";
import type { ITemplateLoader } from "../interface/ITemplateLoader";
import { Nota } from "../classes/Nota";
import { PdfTemplateBuild } from "../../infra/service/PdfTemplateBuild";
import { InventarioAlmoxLoader } from "../../infra/service/InventarioAlmoxLoader";


export const __NotaAlmox = Symbol('NotaAlmox');

@Injectable()
export class AlmoxNotaService
    implements IGeracaoNota {

    constructor(
        @Inject(PdfTemplateBuild) private templatebuilder: ITemplateBuilder,
        @Inject(InventarioAlmoxLoader) private templateLoader: ITemplateLoader
    ) { }

    identificador(): Symbol {
        return __NotaAlmox;
    }

    async gerar(nota: Nota[]): Promise<{
        content: Buffer,
        mimeType: OutputFormats,
    }> {
        //estrategia para criar nota
        if (!(nota instanceof NotaAlmox)) throw Error('nota com parâmetros incorretos');

        /**
         * ja compilar o html
         */
        const templateRaw = await this.templateLoader.load({
            data: nota
        });

        /**
         * passar para qlq outro formato
         */
        const templateDone = await this.templatebuilder.builin({
            data: nota,
            template: templateRaw
        });

        return {
            content: templateDone as Buffer,
            mimeType: "application/pdf",
        };
    }
}