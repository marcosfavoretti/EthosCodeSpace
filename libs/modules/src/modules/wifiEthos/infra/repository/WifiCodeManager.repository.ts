import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { WifiCodeManager } from "../../@core/entities/WifiCodeManager.entity";

@Injectable()
export class WifiCodeManagerRepository extends Repository<WifiCodeManager>{
    constructor(
        @InjectDataSource('mongo')
        private datasource: DataSource
    ) { 
        super(WifiCodeManager, datasource.createEntityManager());
    }

}