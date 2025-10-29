import { Partcode } from "src/modules/shared/classes/Partcode";
import { Item } from "../../@core/classes/ItemEstrutura";
import { Inject, Injectable } from "@nestjs/common";
import { EstruturaOracleRepository, EstruturaOracleChildrenResult } from "../../../@logix/infra/repositories/EstruturaOracle.repository";
import { ManProcessoItemRepository, ManProcessoResult, RoteiroProps as ManProcessoRoteiroProps } from "../../../@logix/infra/repositories/ManProcessoItem.repository";
import { ItemManRepository, RoteiroProps as ItemManRoteiroProps } from "../../../@logix/infra/repositories/ItemMan.repository";

@Injectable()
export class LoadEstruturaOracleService {

    constructor(
        @Inject(EstruturaOracleRepository) private estructGradeRepository: EstruturaOracleRepository,
        @Inject(ManProcessoItemRepository) private manProcessoItemRepository: ManProcessoItemRepository,
        @Inject(ItemManRepository) private itemManRepository: ItemManRepository
    ) { }

    public async generate(partcode: Partcode): Promise<Item> {
        const itemStatus = await this.estructGradeRepository.getItemStatus(partcode.getPartcodeNum());
        const itemCliente = await this.estructGradeRepository.getCodItemCliente(partcode.getPartcodeNum());
        const roteiroPadrao: ItemManRoteiroProps = await this.itemManRepository.roteiroPadrao(partcode.getPartcodeNum());
        const operations: ManProcessoResult[] = await this.manProcessoItemRepository.getOperacao(partcode.getPartcodeNum(), roteiroPadrao);
        if (itemStatus !== "F") throw new Error('Não é possível carregar uma estrutura que não é final');
        const finalItem = new Item(
            partcode,
            itemCliente,
            1,
            itemStatus,
            operations
        );
        const struct = await this.generateTree(finalItem);
        finalItem.addFilhos(...struct);
        return finalItem;
    }

    private async generateTree(item: Item): Promise<Item[]> {
        const children: EstruturaOracleChildrenResult[] = await this.estructGradeRepository.getChildren(item.getPartcode().getPartcodeNum());
        if (!children.length) {
            return [];
        }
        const roteiroPadrao: ItemManRoteiroProps = await this.itemManRepository.roteiroPadrao(item.getPartcode().getPartcodeNum());
        const operations: ManProcessoResult[] = await this.manProcessoItemRepository.getOperacao(item.getPartcode().getPartcodeNum(), roteiroPadrao);
        const childrenParsed = await Promise.all(
            children.map(async (child) => {
                const childItem = new Item(
                    new Partcode(child.COD_ITEM_COMPON),
                    child.COD_ITEM_CLIENTE,
                    child.QTD,
                    child.STATUS,
                    operations,
                    [],
                    item);
                const subTree = await this.generateTree(childItem);
                childItem.addFilhos(...subTree);
                return childItem;
            })
        );
        return childrenParsed;
    }
}