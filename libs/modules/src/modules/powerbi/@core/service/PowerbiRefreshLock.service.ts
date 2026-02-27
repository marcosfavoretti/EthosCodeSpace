import { Injectable, Logger } from "@nestjs/common";
import { ICheckRaceCondicion } from "../interfaces/ICheckRaceCondicion";
import { PowerbiStateStoreService } from "./PowerbiStateStore.service";

@Injectable()
export class PowerbiRefreshLockService implements ICheckRaceCondicion {
    constructor(private stateStore: PowerbiStateStoreService) { }
    validRun(): boolean {
        return this.stateStore.isLocked() === false;
    }
}