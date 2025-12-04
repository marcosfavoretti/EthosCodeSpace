import { Inject, Injectable } from '@nestjs/common';
import { ManProcessoItemRepository } from '../../../@logix/infra/repositories/ManProcessoItem.repository';
import { ItemManRepository } from '../../../@logix/infra/repositories/ItemMan.repository';
import { Partcode } from '@app/modules/shared/classes/Partcode';
import { ItemEstruturaTree } from '../../@core/classes/ItemEstruturaTree';
import { EstruturaOracleDAO } from '../dao/EstruturaOracle.dao';
import { ItemEstrutura } from '../../@core/classes/ItemEstrutura';

@Injectable()
export class LoadEstruturaOracleService {
  constructor(
    @Inject(EstruturaOracleDAO) private estruturaOracleDAO: EstruturaOracleDAO,
    @Inject(ManProcessoItemRepository)
    private manProcessoItemRepository: ManProcessoItemRepository,
    @Inject(ItemManRepository) private itemManRepository: ItemManRepository,
  ) {}

  public async generate(partcode: Partcode): Promise<ItemEstruturaTree> {
    const itemStatus = await this.estruturaOracleDAO.getItemStatus(
      partcode.getPartcodeNum(),
    );
    const itemCliente = await this.estruturaOracleDAO.getCodItemCliente(
      partcode.getPartcodeNum(),
    );
    // const roteiroPadrao: ItemManRoteiroProps = await this.itemManRepository.roteiroPadrao(partcode);
    // const operations: ManProcessoResult[] = await this.manProcessoItemRepository.getOperacao(partcode, roteiroPadrao);
    if (itemStatus !== 'F')
      throw new Error('Não é possível carregar uma estrutura que não é final');
    // const finalItem = new ItemEstrutura(
    //     partcode,
    //     itemCliente,
    //     1,
    //     itemStatus,
    //     operations
    // );
    const finalItem = ItemEstruturaTree.createItem({
      ehControle: true,
      itemCliente,
      partcode: partcode,
      qtd: 1,
      status: itemStatus,
    });
    const structChildren = await this.generateTree(finalItem);
    finalItem.addChildren(...structChildren);
    return finalItem;
  }

  private async generateTree(
    item: ItemEstruturaTree,
  ): Promise<ItemEstruturaTree[]> {
    const children: ItemEstrutura[] = await this.estruturaOracleDAO.getChildren(
      item.partcode.getPartcodeNum(),
    );

    if (!children.length) {
      return [];
    }
    const roteiroPadrao: ItemManRoteiroProps =
      await this.itemManRepository.roteiroPadrao(item.partcode);
    // const operations: ManProcessoResult[] = await this.manProcessoItemRepository
    //     .getOperacao(item.partcode.getPartcodeNum(), roteiroPadrao);
    const childrenParsed = await Promise.all(
      children.map(async (child) => {
        // @old
        // const childItem = new Item(
        //     new Partcode(child.COD_ITEM_COMPON),
        //     child.COD_ITEM_CLIENTE,
        //     child.QTD,
        //     child.STATUS,
        //     operations,
        //     [],
        //     item);
        const childItem = ItemEstruturaTree.createItem({
          ehControle: false,
          itemCliente: child.itemCliente,
          partcode: child.partcode,
          qtd: child.qtd,
          status: child.status,
          father: item,
        });
        const subTree = await this.generateTree(childItem);
        childItem.addChildren(...subTree);
        return childItem;
      }),
    );
    return childrenParsed;
  }
}
