import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtHandler } from '../infra/service/JwtHandler';

@Injectable()
export class CheckUserTokenUsecase {
  constructor(private jwtGen: JwtHandler) { }

  public execute(token: string): boolean {
    if (!token) throw new BadRequestException('O Token não é válido');
    const ehvalido = this.jwtGen.checkToken(token);
    if (!ehvalido) throw new BadRequestException('O Token não é válido');
    return ehvalido
  }
}
