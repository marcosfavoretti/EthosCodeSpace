import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { CertificadosCatEntity } from '../../@core/entities/CertificadoCat.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CertificadoCatRepository extends Repository<CertificadosCatEntity> {
  constructor(@InjectDataSource('mongo') dataSource) {
    super(CertificadosCatEntity, dataSource.createEntityManager());
  }
}
