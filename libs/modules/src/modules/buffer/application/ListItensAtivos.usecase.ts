import { Like, Repository } from 'typeorm';
import { ItemBufferResponse } from '../@core/class/ItemBufferResponse';
import { Inject } from '@nestjs/common';
import { ProductionRepository } from '../../@syneco/infra/repositories/Production.repository';
import { Production } from '../../@syneco/@core/entities/Production.entity';
import { ItemXQtdSemanaComBuffer } from '../@core/entities/ItemQtdSemana.entity';
import { ItemQtdSemanaComBufferRepository } from '../infra/repository/ItemQtdSemanaComBuffer.repository';

export class ListItensAtivosUseCase {
  constructor(
    @Inject(ProductionRepository)
    private productionRepo: Repository<Production>,
    @Inject(ItemQtdSemanaComBufferRepository)
    private itemqtdRepo: Repository<ItemXQtdSemanaComBuffer>,
  ) {}

  async list(): Promise<ItemBufferResponse[]> {
    const responseItens: Array<ItemBufferResponse> = [];
    const itens = await this.itemqtdRepo.find({
      where: {
        status: 'S',
        Item: Like('%-110-%'),
      },
      relations: ['bufferHistoricos'],
    });
    for (const item of itens) {
      const production = await this.productionRepo.findOne({
        where: {
          PartCode: item.Item,
        },
        relations: ['productionData'],
        order: {
          ProductionID: 'desc',
        },
      });
      if (!production) continue;
      responseItens.push(new ItemBufferResponse(item, production));
    }
    return responseItens;
  }
}
