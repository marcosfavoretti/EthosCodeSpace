import { Repository } from "typeorm";
import { ItemXQtdSemana } from "../../@core/entities/ItemXQtdSemana.entity";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm/browser";

export class ItemXQtdSemanaRepository extends Repository<ItemXQtdSemana> {
    constructor(
        @InjectDataSource() dt: DataSource
    ) {
        super(ItemXQtdSemana, dt.createEntityManager());
    }
}