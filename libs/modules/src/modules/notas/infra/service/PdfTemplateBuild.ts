import { Injectable } from "@nestjs/common";
import { ITemplateBuilder } from "../../@core/interface/ITemplateBuilder";
import { PdfService } from "./Pdf.service";

@Injectable()
export class PdfTemplateBuild
    implements ITemplateBuilder {

    constructor(
        private pdfservice: PdfService
    ){}

    async builin(props: { template: string; data: unknown; }): Promise<Buffer> {
        const { template, data } = props;
        /**
         * conversao de html para pdf
         */
        const pdf = await this.pdfservice.gerarPdf(template);
        return pdf;
    }
}