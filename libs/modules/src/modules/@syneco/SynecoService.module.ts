import { Module } from "@nestjs/common";
import { ItemXQtdSemanaRepository } from "./infra/repositories/ItemXQtdSemana.repository";
import { ProductionRepository } from "./infra/repositories/Production.repository";
import { ProductionDataRepository } from "./infra/repositories/ProductionData.repository";

@Module({
    providers: [
        ItemXQtdSemanaRepository,
        ProductionRepository,
        ProductionDataRepository
    ],
    exports: [
        ItemXQtdSemanaRepository,
        ProductionRepository,
        ProductionDataRepository
    ]
})
export class SynecoServiceModule{}