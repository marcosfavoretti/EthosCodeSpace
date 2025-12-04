import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ProductionRepository } from '../../@syneco/infra/repositories/Production.repository';
import { CreateNotaPdiEtiquetaDTO } from '@app/modules/contracts/dto/CreateNotaPdiEtiqueta.dto';
import { LabelPDIRepository } from '../infra/repository/LabelPDI.repository';
import { PartSerialNumberBuilder } from '../../@syneco/@core/builder/PartSerialNumber.builder';
import { PartSerialNumberProductionRepository } from '../../@syneco/infra/repositories/PartSerialNumberProduction.repository';
import { LinkOrdemComEtiquetaService } from '../infra/services/LinkOrdemComEtiqueta.service';
import { __NotaPdiEtiqueta } from '../../notas/@core/consts/symbols';
import { NotaPdiEtiquetaService } from '../../notas/@core/service/NotaPdiEtiqueta.service';
import { NotaPDIEtiqueta } from '../../notas/@core/classes/NotaPdiEtiqueta';
import type {
  IGeracaoNota,
  OutputFormats,
} from '../../notas/@core/interface/IGeracaoNota';
import { EntityNotFoundError } from 'typeorm';

@Injectable()
export class EtiquetaPdiUseCase {
  @Inject(ProductionRepository) private productionrepo: ProductionRepository;
  @Inject(LabelPDIRepository) private labelPdiRepository: LabelPDIRepository;
  @Inject(PartSerialNumberProductionRepository)
  private partSerialNumberProductionRepository;
  @Inject(LinkOrdemComEtiquetaService)
  private linkOrdemComEtiquetaService: LinkOrdemComEtiquetaService;
  //TODO> essa outra dependencia deveria ser desacoplada, deveria usar um interface para conversar com o sistema de notas
  @Inject(NotaPdiEtiquetaService) private notaPdiEtiquetaService: IGeracaoNota;

  async make(dto: CreateNotaPdiEtiquetaDTO): Promise<{
    content: Buffer | string;
    mimeType: OutputFormats;
    fileName?: string;
  }> {
    try {
      const { orderNum, serialNumber } = dto;
      const uniqueKey = orderNum.concat(serialNumber);
      /**
       *  valida ordem de producao
       */
      const production = await this.productionrepo.findOneOrFail({
        where: {
          OrderNum: orderNum,
        },
      });
      /**
       * validar se esta unico no banco a chave
       */
      const temNobd = await this.labelPdiRepository.exists({
        where: {
          data: uniqueKey,
        },
      });
      if (temNobd)
        throw new Error('A etiqueta ja tem no banco de dados, tente outra');

      const partSerial = PartSerialNumberBuilder.new()
        .withPartCode(production.PartCode)
        .withSerialNumber(uniqueKey)
        .withAllowMultipleReports(false)
        .withExported(1)
        .withUpdateTimeStamp(new Date())
        .build();
      /**
       * faz o arquivo da etiqueta para a usuario imprimir
       */
      const response = await this.notaPdiEtiquetaService.gerar([
        new NotaPDIEtiqueta(serialNumber, orderNum),
      ]);

      if (!response) throw new Error('Nao foi possivel proceguir sem etiqueta');
      /**
       * salva no banco etiqueta e link
       */
      await this.linkOrdemComEtiquetaService.link(production, uniqueKey);

      await this.labelPdiRepository.save({
        production,
        data: uniqueKey,
      });

      await this.partSerialNumberProductionRepository.save(
        this.partSerialNumberProductionRepository.create({
          ProductionID: production,
          Reported: 0,
          PartialSerialNumberID: partSerial,
        }),
      );
      return response;
    } catch (error) {
      if (error instanceof EntityNotFoundError)
        throw new NotFoundException(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }
}
