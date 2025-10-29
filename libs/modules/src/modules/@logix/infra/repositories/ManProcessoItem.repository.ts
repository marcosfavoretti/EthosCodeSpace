import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { ManProcessoItem } from "../../@core/entities/ManProcessoItem.entity";
import { Partcode } from "@app/modules/shared/classes/Partcode";

export type RoteiroProps = {
    roteiro: string,
    numRoteiro: string
}

export type ManProcessoResult = {
    operacao: string;
    qtdTempo: number;
}

export type ManProcessoMultiResult = {
    operacao: string;
    qtdTempo: number;
    roteiro: string;
    roteiroAlternativo: string;
    item: string;
}

@Injectable()
export class ManProcessoItemRepository extends Repository<ManProcessoItem> {
    
    constructor(@InjectDataSource() dataSource: DataSource) {
        super(ManProcessoItem, dataSource.createEntityManager());
    }

    async getOperacao(partcode: Partcode, roteiroProps: RoteiroProps): Promise<ManProcessoResult[]> {
        const operations = await this.find({
            where: {
                item: partcode.getPartcodeNum(),
                roteiro: roteiroProps.roteiro || "PADRAO",
                roteiroAlternativo: roteiroProps.numRoteiro || "0"
            },
            select: ['operacao', 'qtdTempo']
        });
        return operations.map(op => ({ operacao: op.operacao, qtdTempo: op.qtdTempo }));
    }

    async getOperacoes(partcodes: string[]): Promise<ManProcessoMultiResult[]> {
        const operations = await this.createQueryBuilder('mpi')
            .select(['mpi.operacao', 'mpi.qtdTempo', 'mpi.roteiro', 'mpi.roteiroAlternativo', 'mpi.item'])
            .where('mpi.item IN (:...partcodes)', { partcodes })
            .getMany();

        return operations.map(op => ({
            operacao: op.operacao,
            qtdTempo: op.qtdTempo,
            roteiro: op.roteiro.trim(),
            roteiroAlternativo: op.roteiroAlternativo,
            item: op.item.trim()
        }));
    }
}