import { Inject, Injectable } from '@nestjs/common';
import { ItemEstrutura } from '../../@core/classes/ItemEstrutura';
import { ItemEstruturaTree } from '../../@core/classes/ItemEstruturaTree';
import { EstruturaNeo4jDAO } from '../dao/EstruturaNeo4j.dao';
import { ItemXQtdSemanaRepository } from '@app/modules/modules/@syneco/infra/repositories/ItemXQtdSemana.repository';

@Injectable()
export class CommitInNeo4jService {
  constructor(
    @Inject(EstruturaNeo4jDAO) private estruturaNeo4jDAO: EstruturaNeo4jDAO,
    @Inject(ItemXQtdSemanaRepository)
    private itemQtdSemanaRepository: ItemXQtdSemanaRepository,
    // @Inject(OperationDAO) private operationDao: OperationDAO
  ) {}

  private async ehItemDeControle(partcode: string): Promise<boolean> {
    try {
      return await this.itemQtdSemanaRepository.exists({
        where: {
          Item: partcode,
        },
      });
    } catch (error) {
      console.error('NAO É POSSIVEL DEFINIR ITENS DE CONTROLE');
      return false;
    }
  }

  async transfer(tree: ItemEstruturaTree, i: number = 0): Promise<void> {
    try {
      const { children } = tree;
      if (
        i === 0 ||
        !(await this.estruturaNeo4jDAO.checkNodeExists(
          tree.partcode.getPartcodeNum(),
        ))
      ) {
        const partcode = tree.partcode.getPartcodeNum();
        const ehControle =
          partcode.includes('-110-') || partcode.includes('-000-')
            ? await this.ehItemDeControle(partcode)
            : false;
        await this.estruturaNeo4jDAO.commitItem(
          ItemEstrutura.createItem({
            ehControle: ehControle,
            itemCliente: tree.itemCliente,
            partcode: tree.partcode,
            qtd: tree.qtd,
            status: tree.status,
          }),
        );
        // for (const operation of tree.getOperations()) {
        //     await this.operationDao.createOperationLink(operation, tree.getPartcode().getPartcodeNum());
        // }
      }
      for (const child of children) {
        if (
          !(await this.estruturaNeo4jDAO.checkNodeExists(
            child.partcode.getPartcodeNum(),
          ))
        ) {
          const partcode = child.partcode.getPartcodeNum();
          const ehControle =
            partcode.includes('-110-') || partcode.includes('-000-')
              ? await this.itemQtdSemanaRepository.exists({
                  where: { Item: partcode },
                })
              : false;
          console.log('filho x', child.partcode, child.status);

          await this.estruturaNeo4jDAO.commitItem(
            ItemEstrutura.createItem({
              ehControle: ehControle,
              itemCliente: child.itemCliente,
              partcode: child.partcode,
              qtd: child.qtd,
              status: child.status,
            }),
          );
          // for (const operation of child.getOperations()) {
          //     await this.operationDao.createOperationLink(operation, child.getPartcode().getPartcodeNum());
          // }
        }
        if (
          !(await this.estruturaNeo4jDAO.checkLinkExist(
            tree.partcode.getPartcodeNum(),
            child.partcode.getPartcodeNum(),
          ))
        ) {
          // await this.estruturaNeo4jDAO.link({
          //     child: child.partcode.getPartcodeNum(),
          //     father: tree.partcode.getPartcodeNum(),
          //     qtd: child.qtd,
          //     withFinalItem: tree.isFinal()
          // });
          await this.estruturaNeo4jDAO.link(child);
        }
        await this.transfer(child, i + 1);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
