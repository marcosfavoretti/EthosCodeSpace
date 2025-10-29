import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { EstrutGrade } from "../../@core/entities/EstrutGrade.entity";
import { Item } from "../../@core/entities/Item.entity";
import { formatddMMyyyy } from "../../../../utils/datefns.wrapper";

type EstruturaOracleChildrenResult = {
    COD_ITEM_COMPON: string;
    QTD: number;
    COD_ITEM_CLIENTE: string;
    STATUS: string;
}

@Injectable()
export class EstructGradeRepository extends Repository<EstrutGrade> {

    constructor(
        @InjectDataSource() private dataSource: DataSource
    ) {
        // CORRIGIDO: Deve ser a mesma entidade do "extends"
        super(EstrutGrade, dataSource.createEntityManager());
    }

    async getChildren(itemPai: string): Promise<EstruturaOracleChildrenResult[]> {
        const data_hj = formatddMMyyyy(new Date());

        const result = await this.dataSource.createQueryBuilder(EstrutGrade, 'eg')
            .select([
                'eg.codItemCompon',
                'eg.qtdNecessaria',
                'item.denItemReduz',
                'item.iesTipItem'
            ])
            .innerJoin(Item, 'item', 'eg.codItemCompon = item.codItem')
            .where('eg.codItemPai = :itemPai', { itemPai })
            .andWhere(qb => {
                qb.where('(eg.datValidadeIni IS NULL AND eg.datValidadeFim IS NULL)')
                    .orWhere('(eg.datValidadeIni IS NULL AND eg.datValidadeFim >= :data_hj)')
                    .orWhere('(eg.datValidadeFim IS NULL AND eg.datValidadeIni <= :data_hj)')
                    .orWhere('(:data_hj BETWEEN eg.datValidadeIni AND eg.datValidadeFim)');
            }, { data_hj })
            .getRawMany(); // Use getRawMany because we are selecting specific columns from joined tables

        return result.map(row => ({
            COD_ITEM_COMPON: row.eg_codItemCompon,
            QTD: row.eg_qtdNecessaria,
            COD_ITEM_CLIENTE: row.item_denItemReduz,
            STATUS: row.item_iesTipItem
        }));
    }

    async getCodItemCliente(partcode: string): Promise<string> {
        const item = await this.dataSource.getRepository(Item).findOne({
            where: { codItem: partcode },
            select: ['denItemReduz']
        });
        return item?.denItemReduz ?? "NONE";
    }

    async getItemStatus(partcode: string): Promise<string | undefined> {
        const item = await this.dataSource.getRepository(Item).findOne({
            where: { codItem: partcode },
            select: ['iesTipItem']
        });
        return item?.iesTipItem ?? 'F';
    }
}