import { DataSource, Repository } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { PowerbiAtualizacoes } from "../../@core/entities/PowerbiAtulizacao.entity";
import { IPowerBIAtualizacaoRepository } from "../../@core/interfaces/PowerbiBIAtualizacao.abstract";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PowerbiAtualizacoesRepository extends Repository<PowerbiAtualizacoes> implements IPowerBIAtualizacaoRepository {
    constructor(@InjectDataSource('mysql') dt: DataSource){
        super(PowerbiAtualizacoes, dt.createEntityManager());
    }
}
