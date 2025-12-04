import { Module } from '@nestjs/common';
import { EtiquetaCaterpillarUseCase } from './application/EtiquetaCaterpillar.usecase';
import { EtiquetaPdiUseCase } from './application/EtiquetaPdi.usecase';
import { SynecoServiceModule } from '../@syneco/SynecoService.module';
import { EtiquetaServiceModule } from './EtiquetaService.module';
import { NotasServiceModule } from '../notas/NotasService.module';

@Module({
  imports: [EtiquetaServiceModule, SynecoServiceModule, NotasServiceModule],
  providers: [EtiquetaCaterpillarUseCase, EtiquetaPdiUseCase],
  exports: [EtiquetaCaterpillarUseCase, EtiquetaPdiUseCase],
})
export class EtiquetasModule {}
