import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { WifiCodeMagicLink } from "../../@core/entities/WifiCodeMagicLink.entity";

@Injectable()
export class WifiCodeMagicLinkRepository extends Repository<WifiCodeMagicLink> {
    constructor(
        @InjectDataSource('mongo')
        private datasource: DataSource
    ) {
        super(WifiCodeMagicLink, datasource.createEntityManager())
    }

}