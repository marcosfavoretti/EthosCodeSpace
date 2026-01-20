import type { Request } from "express";

export const IJwtValidate = Symbol('IJwtValidate');
export interface IJwtValidate{
    validate(request: Request): boolean | Promise<boolean>;
}   