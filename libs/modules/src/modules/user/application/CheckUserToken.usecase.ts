import { Injectable } from '@nestjs/common';
import { JwtHandler } from '../infra/service/JwtHandler';

@Injectable()
export class CheckUserTokenUsecase {
  constructor(private jwtGen: JwtHandler) {}

  public execute(token: string): boolean {
    return this.jwtGen.checkToken(token);
  }
}
