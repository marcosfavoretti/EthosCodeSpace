import axios from 'axios';
import { Injectable, Logger } from "@nestjs/common";
import { IActionPreRefresh } from "../../@core/interfaces/action-pre-refresh.abstract";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MicroServiceProductionRelation implements IActionPreRefresh {
    name: string = 'MicroService Production Relation';
    constructor(private configService: ConfigService) { }
    async execute(param: number = 5): Promise<void> {
        try {
            await axios.post(this.configService.getOrThrow<string>('PRODUCTIONRELATION_URL'));
        }
        catch (err) {
            Logger.error(`Servico ${MicroServiceProductionRelation.name} fora do ar!`);
            throw err;
        }
        // console.log(log.toString());
    }
}