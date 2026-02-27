import { Request } from 'express';
import { IJwtValidate } from '../interfaces/IJwtValidate';
import { User } from '@app/modules/modules/user/@core/entities/User.entity';
import { Injectable, Logger } from '@nestjs/common';
import { CargoEnum } from '@app/modules/modules/user/@core/enum/CARGOS.enum';

@Injectable()
export class JwtDev implements IJwtValidate {
  validate(request: Request): boolean {
    Logger.debug('JWT DEV MODE ON', JwtDev.name);
    const userPayload: Partial<User> = {
      name: 'user',
      id: '1',
      avatar: '',
      cargosLista: [
        CargoEnum.ADMIN
      ],
    };
    request['user'] = userPayload;
    return true;
  }
}
