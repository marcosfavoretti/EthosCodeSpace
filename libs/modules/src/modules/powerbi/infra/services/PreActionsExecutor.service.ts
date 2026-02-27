import { Injectable, Logger } from "@nestjs/common";
import { MicroServiceProductionRelation } from "./ProductionRelation.service";
import { IActionPreRefresh } from "../../@core/interfaces/action-pre-refresh.abstract";
import { PowerbiDatasets } from "../../@core/entities/PowerbiDatasets.entity";
import { IPowerbiRefreshObserver } from "../../@core/interfaces/IPowerbiRefreshObserver";
import { MockPreActionService } from "./MockPreAction.service";

@Injectable()
export class PreActionExecutorService {
    private readonly relation: Map<string, IActionPreRefresh[]>;

    constructor(
        private productionRelation: MicroServiceProductionRelation,
        private debug: MockPreActionService
    ) {
        this.relation = new Map([
            ['GERAL',
                [
                    this.productionRelation,
                    // this.debug
                ]
            ]
        ]);
    }

    async exec(dataset: PowerbiDatasets, observer?: IPowerbiRefreshObserver): Promise<void> {
        try {
            const preAction = this.relation.get(dataset.name.toUpperCase());
            if (!preAction) return;
            for (const action of preAction) {
                observer?.emit(`executando ação ${action.name}`);
                await await action.execute();
            }
        } catch (error) {
            Logger.error(`error na pre action ${error}`);
            throw error;
        }
    }
}