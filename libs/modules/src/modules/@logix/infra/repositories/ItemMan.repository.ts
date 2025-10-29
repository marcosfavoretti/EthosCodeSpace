import { Injectable } from "@nestjs/common";
import { DataSource, Repository, In } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { ItemMan } from "../../@core/entities/ItemMan.entity";
import { Partcode } from "@app/modules/shared/classes/Partcode";

export type RoteiroProps = {
    roteiro: string,
    numRoteiro: string
}

export type RoteiroMultiProps = {
    roteiro: string,
    numRoteiro: string
    cod_item: string
}

@Injectable()
export class ItemManRepository extends Repository<ItemMan> {

    constructor(@InjectDataSource() dataSource: DataSource) {
        super(ItemMan, dataSource.createEntityManager());
    }

    async roteiroPadrao(item: Partcode): Promise<RoteiroProps> {
        const data = await this.findOne({
            where: { codItem: item.getPartcodeNum() },
            select: ['codRoteiro', 'numAlternRoteiro']
        });
        if (!data) throw new Error('Sem roteiro padrão');
        return {
            roteiro: data.codRoteiro.trim(),
            numRoteiro: data.numAlternRoteiro.trim()
        };
    }

    async roteirosPadroes(itens: string[]): Promise<RoteiroMultiProps[]> {
        if (!itens.length) return [];
        const data = await this.find({
            where: { codItem: In(itens) },
            select: ['codRoteiro', 'numAlternRoteiro', 'codItem']
        });
        if (!data.length) throw new Error('Sem roteiro padrão');
        return data.map(row => ({
            roteiro: row.codRoteiro.trim(),
            numRoteiro: row.numAlternRoteiro.trim(),
            cod_item: row.codItem.trim()
        }));
    }
}