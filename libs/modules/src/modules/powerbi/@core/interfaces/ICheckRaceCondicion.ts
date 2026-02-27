

export const ICheckRaceCondicion = Symbol('ICheckRaceCondicion');
export interface ICheckRaceCondicion {
    validRun(): boolean;
}