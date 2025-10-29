import { Repository } from "typeorm";
import { Production } from "../entities/Production.entity";

export interface IProductionRepository extends Repository<Production>{
    findProductionsStategy():Promise<Production[]>;
    findProductionByItemClient(itens: Array<string>): Promise<Production[]>;
    findByPedidoAndDataEntrega({partcode,pedido, dataEntrega}:{partcode: string,pedido: string, dataEntrega: Date}):Promise<Production[]>;
}
export const IProductionRepository = Symbol('IProductionRepository');