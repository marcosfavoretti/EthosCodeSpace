import { Module } from '@nestjs/common';
import { LinkOrdemComEtiquetaService } from './infra/services/LinkOrdemComEtiqueta.service';
import { LabelPDIRepository } from './infra/repository/LabelPDI.repository';
import { SynecoServiceModule } from '../@syneco/SynecoService.module';

@Module({
  imports: [SynecoServiceModule],
  providers: [LinkOrdemComEtiquetaService, LabelPDIRepository],
  exports: [LinkOrdemComEtiquetaService, LabelPDIRepository],
})
export class EtiquetaServiceModule {}
