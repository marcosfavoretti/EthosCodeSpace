import {
  Inject,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ISetUserCargo } from '../@core/interfaces/ISetUserCargo';
import { IUserService } from '../@core/interfaces/IUserService';
import { SetUserCargoDTO } from '@app/modules/contracts/dto/SetUserCargo.dto';
import { EntityNotFoundError } from 'typeorm';

export class SetUseCargoUseCase {
  constructor(
    @Inject(IUserService) private userService: IUserService,
    @Inject(ISetUserCargo) private setUserCargoService: ISetUserCargo,
  ) {}

  async set(dto: SetUserCargoDTO): Promise<void> {
    try {
      const user = await this.userService.getUser(dto.userId);
      await this.setUserCargoService.setUserCargo(user, dto.cargo);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException('Usuário não encontrado');
      }
      Logger.error(error, SetUseCargoUseCase.name);
      throw new InternalServerErrorException(
        'falha ao atualizar cargo do usuário',
      );
    }
  }
}
