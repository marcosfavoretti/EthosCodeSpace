import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CargoInapropriadoException } from '../../modules/user/@core/exception/CargoInapropriado.exception';
import { ROLES_KEY } from '@app/modules/shared/decorators/Cargo.decorator';
import { User } from '../../modules/user/@core/entities/User.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    if (user?.cargosLista === undefined) throw new CargoInapropriadoException();
    const ok = requiredRoles.some((role) => user?.cargosLista.includes(role));
    if (!ok) throw new CargoInapropriadoException();
    return true;
  }
}
