import { GerenciaCargo } from '../entities/GerenciaCargo.entity';
import { User } from '../entities/User.entity';

export const IGetUserCargos = Symbol('IGetUserCargos');

export interface IGetUserCargos {
  getUserCargos(user: User): Promise<GerenciaCargo[]>;
}
