import { GerenciaCargo } from "../entities/GerenciaCargo.entity";
import { CargoEnum } from "../enum/CARGOS.enum";
import { User } from "../entities/User.entity";

export const ISetUserCargo = Symbol('ISetUserCargo');
export interface ISetUserCargo {
    setUserCargo(user: User, cargo: CargoEnum):Promise<GerenciaCargo>;
}