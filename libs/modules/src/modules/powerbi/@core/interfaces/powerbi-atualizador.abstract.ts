import { PowerbiDatasets } from "../entities/PowerbiDatasets.entity";

export interface IPowerbiAtualizador {
    refreshPowerbi(dataset: PowerbiDatasets, ws?: any): Promise<void>;
}

export const IPowerbiAtualizador = Symbol('IPowerbiAtualizador');
