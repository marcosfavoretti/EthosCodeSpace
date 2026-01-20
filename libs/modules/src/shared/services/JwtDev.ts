import { Request } from 'express';
import { IJwtValidate } from '../interfaces/IJwtValidate';
import { User } from '@app/modules/modules/user/@core/entities/User.entity';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class JwtDev implements IJwtValidate {
  validate(request: Request): boolean {
    Logger.debug('JWT DEV MODE', JwtDev.name);
    const userPayload: Partial<User> = {
      name: 'user',
      avatar: '',
      cargosLista: [],
    };
    request['user'];
    return true;
  }
}
