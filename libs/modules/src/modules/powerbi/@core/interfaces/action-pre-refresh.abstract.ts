export interface IActionPreRefresh{
    name: string;
    execute(param?: unknown): Promise<void>
}