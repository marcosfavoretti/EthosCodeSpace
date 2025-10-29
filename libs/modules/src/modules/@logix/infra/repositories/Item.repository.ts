import { Repository } from "typeorm";
import { Item } from "../../@core/entities/Item.entity";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm/browser";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ItemRepository extends Repository<Item> {
    constructor(
        @InjectDataSource() dt: DataSource
    ) {
        super(Item, dt.createEntityManager());
    }

}