import { Module } from '@nestjs/common';
import { NotaPayloadFactory } from './@core/service/NotaPayloadFactory';
import { NotaServiceFactory } from './@core/service/NotaServiceFactory';
import { HtmlTemplateBuild } from './infra/service/HtmlTemplateBuild';
import { InventarioAlmoxLoader } from './infra/service/InventarioAlmoxLoader';
import { PdfTemplateBuild } from './infra/service/PdfTemplateBuild';
import { AlmoxNotaService } from './@core/service/AlmoxNota.service';
import { InventarioAlmoxService } from './@core/service/InventarioAlmox.service';
import { NotaServicesProviders } from './NotaServices.provider';
import { PdfService } from './infra/service/Pdf.service';
import { NotaPdiEtiquetaService } from './@core/service/NotaPdiEtiqueta.service';
import { ImageTemplateBuildService } from './infra/service/ImageTemplateBuild.service';
import { PdiLabelLoader } from './infra/service/PdiLabelLoader';
import { Html2Image } from './infra/service/Html2Image.service';

@Module({
  imports: [],
  providers: [
    NotaServicesProviders,
    NotaPayloadFactory,
    NotaServiceFactory,
    HtmlTemplateBuild,
    NotaPdiEtiquetaService,
    ImageTemplateBuildService,
    PdfService,
    InventarioAlmoxLoader,
    PdfTemplateBuild,
    AlmoxNotaService,
    PdiLabelLoader,
    Html2Image,
    InventarioAlmoxService,
  ],
  exports: [
    Html2Image,
    ImageTemplateBuildService,
    PdiLabelLoader,
    PdfService,
    NotaPdiEtiquetaService,
    NotaPayloadFactory,
    NotaServiceFactory,
    HtmlTemplateBuild,
    InventarioAlmoxLoader,
    PdfTemplateBuild,
    AlmoxNotaService,
    InventarioAlmoxService,
  ],
})
export class NotasServiceModule {}
