import { Injectable } from "@nestjs/common";
import { ITemplateBuilder } from "../../@core/interface/ITemplateBuilder";

@Injectable()
export class HtmlTemplateBuild
    implements ITemplateBuilder {

    async builin(props: { template: string; data: unknown; }): Promise<string> {
        return "NONO";
    }
}