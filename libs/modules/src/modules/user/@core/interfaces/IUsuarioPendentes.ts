import { User } from '../entities/User.entity';

export const IUsuarioPendentes = Symbol('IUsuarioPendentes');
export interface IUsuarioPendentes {
  add(token: string, user: User): Promise<void>;
  get(token: string): Promise<User>;
  remove(token: string): Promise<void>;
}
