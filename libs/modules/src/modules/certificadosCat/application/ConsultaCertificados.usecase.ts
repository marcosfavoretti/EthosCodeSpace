import { Injectable, Logger } from '@nestjs/common';
import { CertificadoCatRepository } from '../infra/repository/CertificadoCat.repository';
import { ConsultaCertificadosDTO } from '@app/modules/contracts/dto/ConsultaCertificados.dto';
import { ResponsePaginatorDTO } from '@app/modules/contracts/dto/ResponsePaginator.dto';
import { CertificadosCatEntity } from '../@core/entities/CertificadoCat.entity';
import { FindManyOptions } from 'typeorm';

@Injectable()
export class ConsultaCertificadosUseCase {
  constructor(private readonly certificadoRepository: CertificadoCatRepository) { }

  async execute(
    query: ConsultaCertificadosDTO,
  ): Promise<ResponsePaginatorDTO<CertificadosCatEntity>> {

    let { page, limit, } = query;
    const { produto, seriaNumber } = query;

    page = Number(page ?? 0);
    limit = Number(limit ?? 5);

    const where: FindManyOptions<CertificadosCatEntity>['where'] = {};


    if (produto) {
      where.produto = new RegExp(`^${produto}`) as any;
    }

    if (seriaNumber) {
      where.serialNumber = new RegExp(`^${seriaNumber}`) as any;
    }

    const [certificados, total] = await this.certificadoRepository.findAndCount({
      where,
      take: limit,
      skip: page * limit,
      order: {
        serverTime: 'DESC',
      },
    });


    return new ResponsePaginatorDTO(certificados, total, page, limit);
  }
}
