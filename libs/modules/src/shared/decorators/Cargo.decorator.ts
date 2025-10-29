import { CargoEnum } from '@app/modules/modules/user/@core/enum/CARGOS.enum';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: CargoEnum[]) => SetMetadata(ROLES_KEY, roles);