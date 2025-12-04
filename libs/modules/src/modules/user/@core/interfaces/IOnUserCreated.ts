import { User } from "../entities/User.entity";
export const IOnUserCreated = Symbol('IOnUserCreated');
export interface IOnUserCreated {
    oncreate(props: {user: User, code: string}):Promise<void>;
}