import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Injectable,
  Logger,
  Inject,
} from '@nestjs/common';
import { Request } from 'express';
import { IJwtValidate } from '../interfaces/IJwtValidate';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    @Inject(IJwtValidate)
    private jwtValidate: IJwtValidate,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    return this.jwtValidate.validate(request);
  }
}
