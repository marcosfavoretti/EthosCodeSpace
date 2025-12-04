import { Module } from '@nestjs/common';
import { ReportQualidadeService } from './infra/service/ReportQualidade.service';
import { IReportQualidadeRepository } from './@core/interfaces/perguntaParaQualidade.abstract';
import { ReportQualidadeRepository } from './infra/repository/ReportQualidade.repository';
import { IQualidadeImagemRepository } from './@core/interfaces/IQualidadeImagemRepository';
import { QualidadeImageRepository } from './infra/repository/QualidadeImagens.repository';

@Module({
  imports: [],
  providers: [
    ReportQualidadeService,
    {
      provide: IReportQualidadeRepository,
      useClass: ReportQualidadeRepository,
    },
    {
      provide: IQualidadeImagemRepository,
      useClass: QualidadeImageRepository,
    },
  ],
  exports: [IReportQualidadeRepository, ReportQualidadeService],
})
export class GaleriaFotosServiceModule {}
