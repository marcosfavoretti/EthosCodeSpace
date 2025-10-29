import { Inject, Injectable } from "@nestjs/common";
import { Neo4jService } from "nest-neo4j/dist";
// import { EstruturaDto } from "./dto/Estrutura.dto";
// import { ItemDto } from "./dto/Item.dto";
// import { ItemRelationDto } from "./dto/ItemRelation.dto";
import { ItemEstrutura } from "../../@core/classes/ItemEstrutura";
import { IConsultaEstrutura } from "../../@core/interfaces/IConsutaEstrutura";
import { IEstaNaEstrutura } from "../../@core/interfaces/IEstaNaEstrutura";
import { Partcode } from "@app/modules/shared/classes/Partcode";

@Injectable()
export class EstruturaNeo4jDAO implements
    IConsultaEstrutura,
    IEstaNaEstrutura {
    constructor(@Inject() private neo4j: Neo4jService) { }

    async getItens(estrutura: Partcode, partcodes: Partcode[]): Promise<ItemEstrutura[]> {
        // Se a lista de partcodes para busca estiver vazia, não há necessidade de consultar o banco.
        if (!partcodes || partcodes.length === 0) {
            return [];
        }
        try {
            // Converte os objetos Partcode em strings para usar como parâmetros na query.
            const partcodePai = estrutura.getPartcodeNum();
            const partcodesAlvo = partcodes.map(p => p.getPartcodeNum());

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
                partcodesAlvo: partcodesAlvo
            });

            // Mapeia cada registro retornado para o formato de objeto esperado.
            return result.records.map(record => {
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

    async verificaNaEstrutura(estrutura: string, partcodes: string[]): Promise<boolean> {
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
                { partcodePai: estrutura, partcodeAlvos: partcodes }
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


    async deleteEstrutura(partcodeFinal: Partcode): Promise<void> {
        const session = this.neo4j.getWriteSession();
        const partcode = partcodeFinal.getPartcodeNum();
        try {
            await session.executeWrite(async tx => {
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
                    { partcode }
                );
                await tx.run(
                    `
                    MATCH (root:ItemFinal {partcode: $partcode})
                    DETACH DELETE root
                    `,
                    { partcode }
                );
            })
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            await session.close();
        }
    }

    async getItensDeControle(partcode: Partcode): Promise<ItemEstrutura[]> {
        try {
            const query = `
                MATCH (pai:ItemFinal {partcode: $partcode})-[:CONTEM*]->(filho: Item {ehControle: true})
                RETURN filho {.*}
            `;
            const result = await this.neo4j.read(query, { partcode: partcode.getPartcodeNum() });
            return result.records
                .map(t => t.get('filho'))
                .map(i => ItemEstrutura.createItem({
                    partcode: i.partcode,
                    itemCliente: i.itemCliente,
                    qtd: 0,
                    status: i.status,
                    ehControle: i.ehControle,
                }));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }


    async commitItem(param: ItemEstrutura): Promise<void> {
        try {
            if (param.getStatus() === 'F') {
                await this.neo4j.write(`
                CREATE (:ItemFinal {partcode: '${param.getPartcode().getPartcodeNum()}', status: '${param.getStatus()}', itemCliente: '${param.getCodItemCliente()}', ehControle: ${param.getEhControle()}})
            `)
            }
            else {
                await this.neo4j.write(`
                CREATE (:Item {partcode: '${param.getPartcode().getPartcodeNum()}', status: '${param.getStatus()}', itemCliente: '${param.getCodItemCliente()}', ehControle: ${param.getEhControle()}})
            `)
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getEstruturaDepth(partcodeFinal: Partcode): Promise<number> {
        try {
            const { records } = await this.neo4j.read(
                `
                MATCH (root:ItemFinal {partcode: $partcode})-[:CONTEM*]->(child:Item)
                WITH root, child, length(shortestPath((root)-[:CONTEM*]->(child))) AS depth
                RETURN MAX(depth) AS maxDepth
                `,
                {
                    partcode: partcodeFinal.getPartcodeNum()
                }
            );
            return records.length > 0 ? records[0].get('maxDepth').low : 0;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

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

    // async searchByOperationInHierarchy(itemfinal: Partcode, operation: string): Promise<ItemRelationDto[]> {
    //     const result = await this.neo4j.write(`
    //             MATCH (e)
    //             WHERE (e:Item OR e:ItemFinal) AND e.partcode = $partcode
    //             MATCH p=(e)-[PASSA*]->(op:Operation {operation: $op})
    //             RETURN e 
    //         `, {
    //         param: itemfinal.getPartcodeNum(),
    //         op: operation
    //     })
    //     return result.records.map(p => p.get('e'))
    // }

    async link(param: ItemEstrutura): Promise<void> {
        if (param.getStatus() === 'F') {
            this.linkFinalItem(param);
        }
        else {
            this.linkItem(param);
        }
    }

    private async linkFinalItem(param: ItemEstrutura) {
        try {
            await this.neo4j.write(`
                MATCH (pai:ItemFinal {partcode: '${param.getItemPai()?.getPartcode().getPartcodeNum()}'}), 
                (filho:Item {partcode: '${param.getPartcode().getPartcodeNum()}'})
                CREATE (pai)-[:CONTEM {qtd: '${param.getQtd()}'}]->(filho)
            `)
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    private async linkItem(param: ItemEstrutura) {
        try {
            await this.neo4j.write(`
                MATCH (pai:Item {partcode: '${param.getItemPai()?.getPartcode().getPartcodeNum()}'}), (filho:Item {partcode: '${param.getPartcode().getPartcodeNum()}'})
                CREATE (pai)-[:CONTEM {qtd: '${param.getQtd()}'}]->(filho)
            `)
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async getItem(partcode: Partcode): Promise<ItemEstrutura | undefined> {
        const { records } = await this.neo4j.read(
            `
            MATCH path = (item:Item {partcode: $partcode})
            RETURN item {.*}
            `,
            {
                partcode: partcode.getPartcodeNum()
            }
        )
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

    async getEstruturaAsList(partcodeFinal: Partcode): Promise<ItemEstrutura[] | undefined> {
        const { records } = await this.neo4j.read(
            `
            MATCH (root:ItemFinal {partcode: $partcode})
            RETURN root {.*, qtd: 1} AS item
            UNION ALL
            MATCH path = (root:ItemFinal {partcode: $partcode})-[rels:CONTEM*0..]->(child:Item)
            WITH child, last(rels) AS last_rel
            RETURN child {
            .*, 
            qtd: coalesce(last_rel.qtd, 1)
            } AS item
            `,
            {
                partcode: partcodeFinal.getPartcodeNum()
            }
        )
        const list: ItemEstrutura[] = records.map(p => p.get('item'));
        if (Object.keys(list).length === 0) {
            return undefined;
        }
        return list;
    }

    async getEstrutura(partcodeFinal: Partcode): Promise<ItemEstrutura | undefined> {
        const { records } = await this.neo4j.read(
            `
            MATCH path = (root:ItemFinal {partcode: $partcode})-[:CONTEM*0..]->(child:Item)
            WITH collect(path) AS paths
            CALL apoc.convert.toTree(paths) YIELD value
            RETURN value
            `,
            {
                partcode: partcodeFinal.getPartcodeNum()
            }
        )
        const tree: EstruturaDto = records[0].get('value');
        if (Object.keys(tree).length === 0) {
            return undefined;
        }
        return tree;
    }

    async listEstruturasDependentes(partcode: Partcode): Promise<Array<ItemDto>> {
        const { records } = await this.neo4j.read(
            `
                MATCH p=(f:ItemFinal)-[r:CONTEM*]->({partcode:$partcode}) return DISTINCT f {.*} as props 
            `,
            {
                partcode: partcode.getPartcodeNum()
            }
        );
        const partcodes: ItemDto[] = records?.map(record => record.get('props'));
        return partcodes;
    }


    async listEstruturas(): Promise<ItemDto[]> {
        const { records } = await this.neo4j.read(
            'MATCH (i: ItemFinal) RETURN i {.*} as props',
        )
        const partcodes: ItemDto[] = records.map(record => record.get('props'));
        return partcodes;
    }
}