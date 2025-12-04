import { jwtWrapper } from '@app/modules/utils/jwt.wrapper';
import { User } from '../../@core/entities/User.entity';
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class JwtHandler {
  private secretKey: string;
  private expiresIn: number;

  constructor(private configService: ConfigService) {
    this.secretKey = this.configService.get<string>('SECRET', 'default-secret');
    this.expiresIn = this.configService.get<number>('EXPIREHOURS', 3600);
  }

  checkToken(token: string): boolean {
    try {
      jwtWrapper().verify(token, this.secretKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  decodeToken(token: string): unknown {
    try {
      return jwtWrapper().decode(token);
    } catch (error) {
      return null;
    }
  }

  generateToken<T>(payload: T): string {
    Logger.log(payload)
    return jwtWrapper().sign(JSON.stringify(payload), this.secretKey);
  }
}
