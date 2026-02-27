import { Injectable } from "@nestjs/common";
import { IActionPreRefresh } from "../../@core/interfaces/action-pre-refresh.abstract";

@Injectable()
export class MockPreActionService implements IActionPreRefresh {
    execute(param?: unknown): Promise<void> {
        //intervalo de 5 s rodando 
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 5000);
        });
    }

    name: string = 'MockPreActionService';
}