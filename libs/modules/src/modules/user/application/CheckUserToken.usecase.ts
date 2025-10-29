import { Injectable } from "@nestjs/common";
import { JwtHandler } from "../infra/service/JwtHandler";

@Injectable()
export class CheckUserTokenUsecase {
    private jwtGen: JwtHandler = new JwtHandler();

    public execute(token: string): boolean {
        return this.jwtGen.checkToken(token);
    }
}