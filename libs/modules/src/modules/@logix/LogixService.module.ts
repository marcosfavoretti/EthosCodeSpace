import { Module } from "@nestjs/common";
import { ItemRepository } from "./infra/repositories/Item.repository";
import { ItemManRepository } from "./infra/repositories/ItemMan.repository";
import { ManProcessoItemRepository } from "./infra/repositories/ManProcessoItem.repository";
import { EstructGradeRepository } from "./infra/repositories/EstrutGrade.repository";

@Module({
    providers: [
        ItemRepository,
        ItemManRepository,
        ManProcessoItemRepository,
        EstructGradeRepository
    ],
    exports: [
        EstructGradeRepository,
        ItemRepository,
        ItemManRepository,
        ManProcessoItemRepository
    ]
})
export class LogixServiceModule {

}