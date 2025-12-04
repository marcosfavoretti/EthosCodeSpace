import { Inject, Injectable, Logger } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { ItemEstrutura } from '../../@core/classes/ItemEstrutura';
import { IConsultaEstrutura } from '../../@core/interfaces/IConsutaEstrutura';
import { IEstaNaEstrutura } from '../../@core/interfaces/IEstaNaEstrutura';
import { Partcode } from '@app/modules/shared/classes/Partcode';
import { ItemEstruturaTree } from '../../@core/classes/ItemEstruturaTree';

@Injectable()
export class EstruturaNeo4jDAO implements IConsultaEstrutura, IEstaNaEstrutura {
  constructor(@Inject() private neo4j: Neo4jService) {}

  /**
   * @param estrutura
   * @param partcodes
   * @returns
   * @description volta um lista de itens dentro da estrutura informada, esse metodo volta uma list flat
   */
  async getItens(
    estrutura: Partcode,
    partcodes: Partcode[],
  ): Promise<ItemEstrutura[]> {
    // Se a lista de partcodes para busca estiver vazia, não há necessidade de consultar o banco.
    if (!partcodes || partcodes.length === 0) {
      return [];
    }
    try {
      // Converte os objetos Partcode em strings para usar como parâmetros na query.
      const partcodePai = estrutura.getPartcodeNum();
      const partcodesAlvo = partcodes.map((p) => p.getPartcodeNum());

      const query = `
                MATCH (root:ItemFinal {partcode: $partcodePai})-[rels:CONTEM*]->(descendant:Item)
                
                // 2. Filtra para encontrar apenas os partcodes desejados
                WHERE descendant.partcode IN $partcodesAlvo

                // 3. Isola o descendente e a última relação no caminho
                WITH descendant, last(rels) AS last_rel

                // 4. Retorna as propriedades do descendente, adicionando a qtd da última relação
                RETURN DISTINCT descendant { 
                    .*, 
                    qtd: coalesce(last_rel.qtd, 1)
                } AS item
            `;

      const result = await this.neo4j.read(query, {
        partcodePai: partcodePai,
        partcodesAlvo: partcodesAlvo,
      });

      // Mapeia cada registro retornado para o formato de objeto esperado.
      return result.records.map((record) => {
        const item = record.get('item');
        return ItemEstrutura.createItem({
          partcode: item.partcode,
          itemCliente: item.itemCliente,
          qtd: item.qtd,
          status: item.status,
          ehControle: item.ehControle,
        });
      });
    } catch (error) {
      console.error('Erro ao buscar itens na estrutura:', error);
      throw error;
    }
  }

  /**
   *
   * @param estrutura
   * @param partcodes
   * @returns
   * @description verfica se todos os itens estao na estrutura
   */
  async verificaNaEstrutura(
    estrutura: string,
    partcodes: string[],
  ): Promise<boolean> {
    const session = this.neo4j.getReadSession();

    try {
      const result = await session.run(
        `
            WITH 
                $partcodePai AS partcode_pai, 
                $partcodeAlvos AS partcodes_obrigatorios
            OPTIONAL MATCH (a:ItemFinal {partcode: partcode_pai})
            CALL {
                WITH a, partcodes_obrigatorios
                MATCH (a)-[:CONTEM*]->(b:Item)
                WHERE b.partcode IN partcodes_obrigatorios
                RETURN count(DISTINCT b) AS encontrados
            }
            RETURN size(partcodes_obrigatorios) = encontrados AS todos_existem
            `,
        { partcodePai: estrutura, partcodeAlvos: partcodes },
      );
      const singleRecord = result.records[0];
      if (!singleRecord) {
        return false;
      }
      return singleRecord.get('todos_existem');
    } finally {
      // Garante que a sessão será fechada, mesmo se ocorrer um erro
      await session.close();
    }
  }

  /**
   *
   * @param partcodeFinal
   * @description deleta estrutura do banco neo4j
   */
  async deleteEstrutura(partcodeFinal: Partcode): Promise<void> {
    const session = this.neo4j.getWriteSession();
    const partcode = partcodeFinal.getPartcodeNum();
    try {
      await session.executeWrite(async (tx) => {
        await tx.run(
          `
                    MATCH (root:ItemFinal {partcode: $partcode})
                    CALL apoc.path.subgraphNodes(root, {
                        relationshipFilter: "CONTEM>",
                        labelFilter: "Item"
                    }) YIELD node
                    WITH node
                    OPTIONAL MATCH (otherRoot:ItemFinal)-[:CONTEM*]->(node)
                    WHERE otherRoot.partcode <> $partcode
                    WITH node, COUNT(otherRoot) AS otherReferences
                    FOREACH (_ IN CASE WHEN otherReferences = 0 THEN [1] ELSE [] END |
                        DETACH DELETE node
                    )
                    `,
          { partcode },
        );
        await tx.run(
          `
                    MATCH (root:ItemFinal {partcode: $partcode})
                    DETACH DELETE root
                    `,
          { partcode },
        );
      });
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      await session.close();
    }
  }

  /**
   *
   * @param partcode
   * @returns
   * @description retorna o item de controle da estrura requisitada
   */
  async getItensDeControle(partcode: Partcode): Promise<ItemEstrutura[]> {
    try {
      const query = `
                MATCH (pai:ItemFinal {partcode: $partcode})-[:CONTEM*]->(filho: Item {ehControle: true})
                RETURN filho {.*}
            `;
      const result = await this.neo4j.read(query, {
        partcode: partcode.getPartcodeNum(),
      });
      return result.records
        .map((t) => t.get('filho'))
        .map((i) =>
          ItemEstrutura.createItem({
            partcode: i.partcode,
            itemCliente: i.itemCliente,
            qtd: 0,
            status: i.status,
            ehControle: i.ehControle,
          }),
        );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   *
   * @param param
   * @description passa o item da estrutura para o banco do neo4j
   */
  async commitItem(param: ItemEstrutura): Promise<void> {
    try {
      if (param.status === 'F') {
        await this.neo4j.write(`
                CREATE (:ItemFinal {partcode: '${param.partcode.getPartcodeNum()}', status: '${param.status}', itemCliente: '${param.itemCliente}', ehControle: ${param.ehControle}})
            `);
      } else {
        await this.neo4j.write(`
                CREATE (:Item {partcode: '${param.partcode.getPartcodeNum()}', status: '${param.status}', itemCliente: '${param.itemCliente}', ehControle: ${param.ehControle}})
            `);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   *
   * @param partcodeFinal
   * @returns
   * @description retorna quantos niveis a estrutura tem
   */
  async getEstruturaDepth(partcodeFinal: Partcode): Promise<number> {
    try {
      const { records } = await this.neo4j.read(
        `
                MATCH (root:ItemFinal {partcode: $partcode})-[:CONTEM*]->(child:Item)
                WITH root, child, length(shortestPath((root)-[:CONTEM*]->(child))) AS depth
                RETURN MAX(depth) AS maxDepth
                `,
        {
          partcode: partcodeFinal.getPartcodeNum(),
        },
      );
      return records.length > 0 ? records[0].get('maxDepth').low : 0;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   *
   * @param partcode
   * @returns
   * @description verfica se existe a estrutura no banco
   */
  async checkNodeExists(partcode: string): Promise<boolean> {
    try {
      const result = await this.neo4j.read(`
                MATCH (n:Item {partcode: '${partcode}'})
                RETURN n
            `);
      return result.records.length > 0;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   *
   * @param father
   * @param child
   * @returns
   * @description verifica se existe o link entre o item pai e o filho no banco
   */
  async checkLinkExist(father: string, child: string): Promise<boolean> {
    try {
      const query = `
                MATCH (pai:Item {partcode: $father})-[:CONTEM]->(filho:Item {partcode: $child})
                RETURN pai, filho
            `;
      const result = await this.neo4j.read(query, { father, child });
      return result.records.length > 0;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * @param param
   */
  async link(param: ItemEstruturaTree): Promise<void> {
    if (param.status === 'F') {
      this.linkFinalItem(param);
    } else {
      this.linkItem(param);
    }
  }

  /**
   *
   * @param param
   */
  private async linkFinalItem(param: ItemEstruturaTree) {
    try {
      if (param?.father?.partcode.getPartcodeNum()) {
        Logger.log(`O item nao tem pai - > ${param.partcode.getPartcodeNum()}`);
      }
      await this.neo4j.write(`
                MATCH (pai:ItemFinal {partcode: '${param?.father?.partcode.getPartcodeNum()}'}), 
                (filho:Item {partcode: '${param.partcode.getPartcodeNum()}'})
                CREATE (pai)-[:CONTEM {qtd: '${param.qtd}'}]->(filho)
            `);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   *
   * @param param
   */
  private async linkItem(param: ItemEstruturaTree) {
    try {
      if (param?.father?.partcode.getPartcodeNum()) {
        Logger.log(`O item nao tem pai - > ${param.partcode.getPartcodeNum()}`);
      }
      await this.neo4j.write(`
                MATCH (pai:Item {partcode: '${param?.father?.partcode.getPartcodeNum()}'}), (filho:Item {partcode: '${param.partcode.getPartcodeNum()}'})
                CREATE (pai)-[:CONTEM {qtd: '${param.qtd}'}]->(filho)
            `);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   *
   * @param partcode
   * @returns
   */
  async getItem(partcode: Partcode): Promise<ItemEstrutura | undefined> {
    const { records } = await this.neo4j.read(
      `
            MATCH path = (item:Item {partcode: $partcode})
            RETURN item {.*}
            `,
      {
        partcode: partcode.getPartcodeNum(),
      },
    );
    if (!records.length) return undefined;
    const itemRecord = records[0]?.get('item');
    if (!itemRecord || Object.keys(itemRecord).length === 0) {
      return undefined;
    }
    return ItemEstrutura.createItem({
      partcode: itemRecord.partcode,
      itemCliente: itemRecord.itemCliente,
      qtd: itemRecord.qtd || 0,
      status: itemRecord.status,
      ehControle: itemRecord.ehControle,
    });
  }

  /**
   * @param partcodeFinal
   * @returns
   * @description retorna a estrutura como lista flat
   */
  async getEstruturaAsList(
    partcodeFinal: Partcode,
  ): Promise<ItemEstrutura[] | undefined> {
    const { records } = await this.neo4j.read(
      `
            MATCH (root:ItemFinal {partcode: $partcode})
            RETURN root {.*, qtd: toFloat(1)} AS item
            UNION ALL
            MATCH path = (root:ItemFinal {partcode: $partcode})-[rels:CONTEM*0..]->(child:Item)
            WITH child, last(rels) AS last_rel
            RETURN child {
            .*, 
            qtd: coalesce(last_rel.qtd, 1)
            } AS item
            `,
      {
        partcode: partcodeFinal.getPartcodeNum(),
      },
    );
    const list: ItemEstrutura[] = records.map((p) => p.get('item'));
    if (Object.keys(list).length === 0) {
      return undefined;
    }
    return list;
  }

  /**
   * @param partcodeFinal
   * @returns
   * @description retorna a hierarquia da estrutura
   */
  async getEstrutura(
    partcodeFinal: Partcode,
  ): Promise<ItemEstruturaTree | undefined> {
    const { records } = await this.neo4j.read(
      `
            MATCH path = (root:ItemFinal {partcode: $partcode})-[:CONTEM*0..]->(child:Item)
            WITH collect(path) AS paths
            CALL apoc.convert.toTree(paths) YIELD value
            RETURN value
            `,
      {
        partcode: partcodeFinal.getPartcodeNum(),
      },
    );

    if (records.length === 0) {
      return undefined;
    }

    const rawTree = records[0].get('value');

    // Verifica se a consulta retornou uma árvore vazia (nenhum nó encontrado)
    if (!rawTree || Object.keys(rawTree).length === 0) {
      return undefined;
    }

    // Inicia o processo de mapeamento recursivo
    return this.mapRawToTree(rawTree, undefined);
  }

  /**
   * Mapeia recursivamente o objeto JSON bruto do Neo4j para instâncias de ItemEstruturaTree.
   * @param rawNode O nó de objeto JSON bruto retornado pelo APOC.
   * @param father A instância do pai (para referência).
   * @returns Uma instância de ItemEstruturaTree.
   */
  private mapRawToTree(
    rawNode: any,
    father?: ItemEstrutura,
  ): ItemEstruturaTree {
    Logger.debug('eu chego ate aqui?');
    // 1. Extrai a propriedade 'qtd' do relacionamento.
    // O APOC a prefixa como 'contem.qtd'.
    // O nó raiz não terá essa propriedade, então definimos 1 como padrão.
    const qtdString = rawNode['contem.qtd']; // Ex: "1" (como string)
    const qtd = qtdString ? parseInt(qtdString, 10) : 1;

    // 2. Cria a instância do item ATUAL (o "pai" desta iteração)
    // Usamos o factory 'createItem' da sua classe.
    const currentItem = ItemEstruturaTree.createItem({
      partcode: rawNode.partcode,
      itemCliente: rawNode.itemCliente,
      status: rawNode.status,
      ehControle: rawNode.ehControle,
      qtd: qtd,
      father: father,
      children: [], // Começa com filhos vazios
    });

    // 3. Processa os filhos recursivamente
    // Os filhos estão no array 'contem' (o nome do relacionamento)
    if (rawNode.contem && Array.isArray(rawNode.contem)) {
      const children: ItemEstruturaTree[] = rawNode.contem.map(
        (rawChild: any) => {
          // Chama a si mesmo para o nó filho,
          // passando o 'currentItem' que acabamos de criar como o 'father'.
          return this.mapRawToTree(rawChild, currentItem);
        },
      );

      // 4. Adiciona os filhos processados ao item atual
      currentItem.addChildren(...children);
    }

    // 5. Retorna o item totalmente construído (com seus filhos)
    return currentItem;
  }

  /**
   * @param partcode
   * @returns
   * @description listo as estruturas finais que utilizam o item
   */
  async listEstruturasDependentes(
    partcode: Partcode,
  ): Promise<ItemEstrutura[]> {
    const { records } = await this.neo4j.read(
      `
                MATCH p=(f:ItemFinal)-[r:CONTEM*]->({partcode:$partcode}) return DISTINCT f {.*, qtd: 1} as props 
            `,
      {
        partcode: partcode.getPartcodeNum(),
      },
    );
    const partcodes: ItemEstrutura[] = records?.map((record) =>
      record.get('props'),
    );
    return partcodes;
  }

  /**
   *
   * @returns
   * @description lista todos as estrutura finais exportadas no meu banco
   */
  async listEstruturas(): Promise<ItemEstrutura[]> {
    const { records } = await this.neo4j.read(
      'MATCH (i: ItemFinal) RETURN i {.*, qtd: toFloat(1) } as props',
    );
    const partcodes: ItemEstrutura[] = records.map((record) =>
      record.get('props'),
    );
    return partcodes;
  }
}
