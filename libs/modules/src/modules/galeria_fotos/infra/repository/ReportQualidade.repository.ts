import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ReportQualidade } from '../../@core/entities/PerguntaParaQualidade.entity';
import { IReportQualidadeRepository } from '../../@core/interfaces/perguntaParaQualidade.abstract';

export class ReportQualidadeRepository
  extends Repository<ReportQualidade>
  implements IReportQualidadeRepository
{
  constructor(@InjectDataSource('mysql') dt: DataSource) {
    super(ReportQualidade, dt.createEntityManager());
  }
}
