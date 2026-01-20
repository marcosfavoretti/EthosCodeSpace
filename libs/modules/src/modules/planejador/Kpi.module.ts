import { Module } from '@nestjs/common';
import { ConsultarGraficoGanttUseCase } from './application/ConsultarGraficoGantt.usecase';
import { FabricaServiceModule } from './FabricaService.module';
import { ColorGenerator } from '@app/modules/shared/classes/GeradorDeCor';

@Module({
  imports: [FabricaServiceModule],
  providers: [
    ColorGenerator,
    ConsultarGraficoGanttUseCase,
  ],
  exports: [ConsultarGraficoGanttUseCase],
})
export class KpiModule {}
