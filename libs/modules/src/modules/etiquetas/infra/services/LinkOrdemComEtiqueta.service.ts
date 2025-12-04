import { Inject, Injectable } from '@nestjs/common';
import { ILinkOrdemComEtiqueta } from '../../@core/interfaces/ILinkOrdemComEtiqueta';
import { ProductionDataRepository } from '@app/modules/modules/@syneco/infra/repositories/ProductionData.repository';
import { Production } from '@app/modules/modules/@syneco/@core/entities/Production.entity';
import { TypeData } from '@app/modules/modules/@syneco/@core/enum/TypeData.enum';

@Injectable()
export class LinkOrdemComEtiquetaService implements ILinkOrdemComEtiqueta {
  constructor(
    @Inject(ProductionDataRepository)
    private productionDataRepository: ProductionDataRepository,
  ) {}

  async link(production: Production, data: string): Promise<void> {
    const productionDataUpdate = production.concatPrefix(
      data,
      TypeData.ETIQUETAPDI,
    );
    await this.productionDataRepository.save(productionDataUpdate);
  }
}
