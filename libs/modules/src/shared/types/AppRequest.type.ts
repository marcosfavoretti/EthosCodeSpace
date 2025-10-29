import { User } from "@app/modules/modules/user/@core/entities/User.entity";
import { Request } from "express";

export type CustomRequest = Request & {
    user: User;
}