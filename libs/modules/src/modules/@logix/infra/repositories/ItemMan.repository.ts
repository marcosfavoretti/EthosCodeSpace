import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository, In, Raw } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { ItemMan } from '../../@core/entities/ItemMan.entity';
import { Partcode } from '@app/modules/shared/classes/Partcode';

@Injectable()
export class ItemManRepository extends Repository<ItemMan> {
  constructor(@InjectDataSource('logix') dataSource: DataSource) {
    super(ItemMan, dataSource.createEntityManager());
  }

  async roteiroPadrao(item: Partcode): Promise<ItemMan> {
    const data = await this.findOne({
      where: {
        codItem: Raw((aliasDaColuna) => `TRIM(${aliasDaColuna}) = :valor`, {
          valor: item.getPartcodeNum(),
        }),
      },
      select: ['codRoteiro', 'numAlternRoteiro'],
    });
    if (!data) throw new Error('Sem roteiro padrão');
    Logger.log(data);
    return data;
  }
  async roteirosPadroes(itens: string[]): Promise<ItemMan[]> {
    if (!itens.length) return [];

    const data = await this.find({
      where: {
        codItem: Raw(
          (alias) => `TRIM(${alias}) IN (:...itens)`, // Use :... para expandir o array
          { itens: itens }, // Passe o array como parâmetro
        ),
      },
      select: ['codRoteiro', 'numAlternRoteiro', 'codItem'],
    });

    if (!data.length) throw new Error('Sem roteiro padrão');

    return data;
  }
}
