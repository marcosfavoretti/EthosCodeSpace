import { Module } from "@nestjs/common";
import { NotaPayloadFactory } from "./@core/service/NotaPayloadFactory";
import { NotaServiceFactory } from "./@core/service/NotaServiceFactory";
import { HtmlTemplateBuild } from "./infra/service/HtmlTemplateBuild";
import { InventarioAlmoxLoader } from "./infra/service/InventarioAlmoxLoader";
import { PdfTemplateBuild } from "./infra/service/PdfTemplateBuild";
import { AlmoxNotaService } from "./@core/service/AlmoxNota.service";
import { InventarioAlmoxService } from "./@core/service/InventarioAlmox.service";
import { NotaServicesProviders } from "./NotaServices.provider";
import { PdfService } from "./infra/service/Pdf.service";

@Module({
    imports: [],
    providers: [
        NotaServicesProviders,
        NotaPayloadFactory,
        NotaServiceFactory,
        HtmlTemplateBuild,
        PdfService,
        InventarioAlmoxLoader,
        PdfTemplateBuild,
        AlmoxNotaService,
        InventarioAlmoxService,
    ],
    exports: [
        PdfService,
        NotaPayloadFactory,
        NotaServiceFactory,
        HtmlTemplateBuild,
        InventarioAlmoxLoader,
        PdfTemplateBuild,
        AlmoxNotaService,
        InventarioAlmoxService,
    ]
})
export class NotasServiceModule { }