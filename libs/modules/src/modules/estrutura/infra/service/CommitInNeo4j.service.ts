import { Inject, Injectable } from "@nestjs/common";
import { Item } from "../../@core/classes/ItemEstrutura";
import { EstruturaRepository } from "../../../@logix/infra/repositories/Estrutura.repository";
import { OperationDAO } from "src/modules/operacoes/infra/DAO/Operation.dao";
import { ItemQtdSemanaRepository } from "../../../@logix/infra/repositories/ItemQtdSemana.repository";

@Injectable()
export class CommitInNeo4jService {
    constructor(
        @Inject(EstruturaRepository) private neo4jRepository: EstruturaRepository,
        @Inject(ItemQtdSemanaRepository) private itemQtdSemanaRepository: ItemQtdSemanaRepository,
        @Inject(OperationDAO) private operationDao: OperationDAO
    ) { }

    private async ehItemDeControle(partcode: string): Promise<boolean> {
        try {
            return await this.itemQtdSemanaRepository.checkItemDeControle(partcode)
        } catch (error) {
            console.error('NAO É POSSIVEL DEFINIR ITENS DE CONTROLE');
            return false;
        }
    }

    async transfer(tree: Item, i: number = 0): Promise<void> {
        const children = tree.getChildren();
        try {
            if (i === 0 || !(await this.neo4jRepository.checkNodeExists(tree.getPartcode().getPartcodeNum()))) {
                console.log('entrou aqui')
                const partcode = tree.getPartcode().getPartcodeNum();
                const ehControle = (partcode.includes('-110-') || partcode.includes('-000-'))
                    ? await this.ehItemDeControle(partcode)
                    : false;
                await this.neo4jRepository.commitItem({
                    itemCliente: tree.getCodItemCliente(),
                    partcode: tree.getPartcode().getPartcodeNum(),
                    status: tree.getStatus(),
                    ehControle: ehControle
                });
                console.log('cara comitei aqui')
                for (const operation of tree.getOperations()) {
                    await this.operationDao.createOperationLink(operation, tree.getPartcode().getPartcodeNum());
                }
            }
            for (const child of children) {
                if (!(await this.neo4jRepository.checkNodeExists(child.getPartcode().getPartcodeNum()))) {
                    const partcode = child.getPartcode().getPartcodeNum();
                    const ehControle = (partcode.includes('-110-') || partcode.includes('-000-'))
                        ? await this.itemQtdSemanaRepository.checkItemDeControle(partcode)
                        : false;
                    console.log('filho x', child.getPartcode(), child.getStatus())
                    await this.neo4jRepository.commitItem({
                        itemCliente: child.getCodItemCliente(),
                        partcode: child.getPartcode().getPartcodeNum(),
                        status: child.getStatus(),
                        ehControle: ehControle
                    });
                    for (const operation of child.getOperations()) {
                        await this.operationDao.createOperationLink(operation, child.getPartcode().getPartcodeNum());
                    }
                }
                if (!(await this.neo4jRepository.checkLinkExist(tree.getPartcode().getPartcodeNum(), child.getPartcode().getPartcodeNum()))) {
                    await this.neo4jRepository.link({
                        child: child.getPartcode().getPartcodeNum(),
                        father: tree.getPartcode().getPartcodeNum(),
                        qtd: child.getQtd(),
                        withFinalItem: tree.isFinal()
                    });
                }
                await this.transfer(child, i + 1);
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}