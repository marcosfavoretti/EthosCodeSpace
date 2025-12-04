import { Repository } from 'typeorm';
import { ReportQualidade } from '../entities/PerguntaParaQualidade.entity';

export const IReportQualidadeRepository = Symbol('IReportQualidadeRepository');
export interface IReportQualidadeRepository
  extends Repository<ReportQualidade> {}
