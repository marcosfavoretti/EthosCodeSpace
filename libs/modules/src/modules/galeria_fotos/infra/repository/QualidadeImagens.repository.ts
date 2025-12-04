import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { QualidadeImagens } from '../../@core/entities/QualidadeImagens.entity';
import { IQualidadeImagemRepository } from '../../@core/interfaces/IQualidadeImagemRepository';

export class QualidadeImageRepository
  extends Repository<QualidadeImagens>
  implements IQualidadeImagemRepository
{
  constructor(@InjectDataSource('syneco_database') dt: DataSource) {
    super(QualidadeImagens, dt.createEntityManager());
  }
}
