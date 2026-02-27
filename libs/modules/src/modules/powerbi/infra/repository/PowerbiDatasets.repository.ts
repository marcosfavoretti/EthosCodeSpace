import { DataSource, Repository } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { PowerbiDatasets } from "../../@core/entities/PowerbiDatasets.entity";
import { Injectable } from "@nestjs/common";
import { IPowerbiDatasetsRepository } from "../../@core/interfaces/IPowerbiDatasetsRepository";

@Injectable()
export class PowerbiDatasetsRepository extends Repository<PowerbiDatasets> implements IPowerbiDatasetsRepository {
    constructor(@InjectDataSource('mysql') dt: DataSource) {
        super(PowerbiDatasets, dt.createEntityManager());
    }
}
