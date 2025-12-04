import { Injectable } from '@nestjs/common';
import { DataSource, Raw, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { ManProcessoItem } from '../../@core/entities/ManProcessoItem.entity';
import { Partcode } from '@app/modules/shared/classes/Partcode';

// export type RoteiroProps = {
//     roteiro: string,
//     numRoteiro: string
// }

// export type ManProcessoResult = {
//     operacao: string;
//     qtdTempo: number;
// }

// export type ManProcessoMultiResult = {
//     operacao: string;
//     qtdTempo: number;
//     roteiro: string;
//     roteiroAlternativo: string;
//     item: string;
// }

@Injectable()
export class ManProcessoItemRepository extends Repository<ManProcessoItem> {
  constructor(@InjectDataSource('logix') dataSource: DataSource) {
    super(ManProcessoItem, dataSource.createEntityManager());
  }

  async getOperacao(
    partcode: Partcode,
    roteiro: { idRoteiro: string; numRoteiro: number },
  ): Promise<ManProcessoItem[]> {
    console.log(roteiro, partcode);
    const numRoteiroStr = String(roteiro.numRoteiro || '0');
    const operations = await this.find({
      where: {
        // 1. Nomes de parâmetros únicos
        item: Raw((alias) => `TRIM(${alias}) = :itemVal`, {
          itemVal: partcode.getPartcodeNum(),
        }),
        roteiro: Raw((alias) => `TRIM(${alias}) = TRIM(:roteiroVal)`, {
          roteiroVal: roteiro.idRoteiro || 'PADRAO',
        }),
        roteiroAlternativo: Raw((alias) => `TRIM(${alias}) = :numRoteiroVal`, {
          numRoteiroVal: numRoteiroStr,
        }),
      },
    });
    return operations;
  }
  async getOperacoes(partcodes: string[]): Promise<ManProcessoItem[]> {
    const operations = await this.createQueryBuilder('mpi')
      .select([
        'mpi.operacao',
        'mpi.qtdTempo',
        'mpi.roteiro',
        'mpi.roteiroAlternativo',
        'mpi.item',
      ])
      .where('mpi.item IN (:...partcodes)', { partcodes })
      .getMany();

    return operations.map((op) => ({
      operacao: op.operacao,
      qtdTempo: op.qtdTempo,
      roteiro: op.roteiro.trim(),
      roteiroAlternativo: op.roteiroAlternativo,
      item: op.item.trim(),
    }));
  }
}
