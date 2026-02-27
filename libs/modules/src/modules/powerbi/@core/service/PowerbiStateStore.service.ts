import { Injectable, Logger } from "@nestjs/common";
import { PowerbiState } from "../../class/PowerbiState";

@Injectable()
export class PowerbiStateStoreService {
    private state: PowerbiState;

    constructor() {
        this.state = PowerbiState.DEFAULT_STATE();
    }

    setState(state: PowerbiState) {
        this.state = state;
    }

    getState(): PowerbiState {
        return new PowerbiState(this.state.asDto());
    }

    lock(authorName?: string, describe: string = 'está atualizando o powerbi') {
        this.state = new PowerbiState({
            authorName,
            describe,
            using: true
        });
    }

    unlock(describe: string = 'N/A', authorName?: string) {
        this.state = new PowerbiState({
            authorName,
            describe,
            using: false
        });
    }

    isLocked(): boolean {
        return this.state.getUsing();
    }
}