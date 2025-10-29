import { Brackets, DataSource, Repository } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { Production } from "../../@core/entities/Production.entity";
import { IProductionRepository } from "../../@core/interfaces/IProductionRepository";
import { TypeData } from "../../@core/enum/TypeData.enum";
import { formatddMMyyyy } from "@app/modules/utils/datefns.wrapper";

export class ProductionRepository extends Repository<Production>
    implements IProductionRepository {

    constructor(@InjectDataSource() dt: DataSource) {
        super(Production, dt.createEntityManager());
    }


    async findProductionByItemClient(itens: Array<string>): Promise<Production[]> {
        const todayMidnight = new Date();
        todayMidnight.setHours(0, 0, 0, 0);
        return await this.createQueryBuilder('production')
            .select(
                [
                    "production.ProductionID",
                    "production.OrderNum",
                    "production.PartCode",
                    "production.PartName",
                    "production.PlanQty",
                    "production.PlannedEndTimestamp",
                    "productionData.TypeDataID",
                    "productionData.Value"
                ]
            )
            .innerJoin("production.productionData", "productionData") // INNER JOIN para garantir que a produção tenha dados de productionData
            .andWhere("production.PlannedEndTimestamp > :todayMidnight", { todayMidnight })
            .andWhere(
                new Brackets(qb => {
                    qb.where(
                        "EXISTS (" +
                        "SELECT 1 FROM productionData pd " +
                        "WHERE pd.ProductionID = production.ProductionID " +
                        "AND pd.TypeDataID = :typeDataTipagem " +
                        "AND pd.Value = :valueTrue" +
                        ")"
                    )
                        .andWhere(
                            "EXISTS (" +
                            "SELECT 1 FROM productionData pd " +
                            "WHERE pd.ProductionID = production.ProductionID " +
                            "AND pd.TypeDataID = :typeDataAbrev " +
                            "AND pd.Value <> :valueAbrev" +
                            ")"
                        )
                        .andWhere(
                            "EXISTS (" +
                            "SELECT 1 FROM productionData pd " +
                            "WHERE pd.ProductionID = production.ProductionID " +
                            "AND pd.TypeDataID = :typeItemCliente " +
                            "AND pd.Value IN (:...item)" +
                            ")"
                        )
                        ;
                })
            )
            .setParameters({
                item: itens,
                typeDataTipagem: TypeData.TIPAGEM_STT,
                typeItemCliente: TypeData.ITEM_CLIENTE,
                valueTrue: "True",
                typeDataAbrev: TypeData.ABREV_TIPO,
                valueAbrev: "P",
            })
            .getMany();
    }

    async findByPedidoAndDataEntrega({ partcode, pedido, dataEntrega }: { partcode: string, pedido: string, dataEntrega: Date }): Promise<Production[]> {
        return await this.query(
            `
                SET DATEFORMAT DMY;
                SELECT * FROM production p join productiondata pd 
                on p.productionid = pd.productionid
                and pd.typeDataId = ${TypeData.PEDIDO}
                join productionData pd2
                on p.productionID = pd2.productionId and pd2.typeDataID = ${TypeData.ITEM_CLIENTE} 
                join plateconversion pc
                on pc.final_item_client_00 = '${partcode}'
                where pd.Value = '${pedido}' 
                and p.PlannedEndTimestamp = '${formatddMMyyyy(dataEntrega)}'
                and p.operation = '00015'
                and p.partCode like '%-110-%'     
                and pd2.Value = pc.conversion_item_client
            `
        )
    }


    async findProductionsStategy(): Promise<Production[]> {
        const currentYear = new Date().getFullYear(); // Obtém o ano atual

        return await this.createQueryBuilder("production")
            .select([
                "production.ProductionID",
                "production.OrderNum",
                "production.PartCode",
                "production.PartName",
                "production.PlanQty",
                "production.PlannedEndTimestamp",
                "productionData.TypeDataID",
                "productionData.Value"
            ])
            .innerJoin("production.productionData", "productionData")
            .where("production.PartCode LIKE :partCodePattern", { partCodePattern: '%-000-%' })
            .andWhere("YEAR(production.PlannedEndTimestamp) = :currentYear", { currentYear }) // Filtro pelo ano atual
            .andWhere(
                new Brackets(qb => {
                    qb.where(
                        "EXISTS (" +
                        "SELECT 1 FROM productionData pd " +
                        "WHERE pd.ProductionID = production.ProductionID " +
                        "AND pd.TypeDataID = :typeDataTipagem " +
                        "AND pd.Value = :valueTrue" +
                        ")"
                    )
                        .andWhere(
                            "EXISTS (" +
                            "SELECT 1 FROM productionData pd " +
                            "WHERE pd.ProductionID = production.ProductionID " +
                            "AND pd.TypeDataID = :typeDataAbrev " +
                            "AND pd.Value <> :valueAbrev" +
                            ")"
                        );
                })
            )
            .setParameters({
                typeDataTipagem: TypeData.TIPAGEM_STT,
                valueTrue: "True",
                typeDataAbrev: TypeData.ABREV_TIPO,
                valueAbrev: "P",
            })
            .getMany();
    }

}