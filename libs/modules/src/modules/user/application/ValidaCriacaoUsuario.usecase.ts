import { Inject, NotFoundException } from '@nestjs/common';
import { IUserService } from '../@core/interfaces/IUserService';
import { IUsuarioPendentes } from '../@core/interfaces/IUsuarioPendentes';
import { ISetUserCargo } from '../@core/interfaces/ISetUserCargo';
import { CargoEnum } from '../@core/enum/CARGOS.enum';
import { boolean, string } from 'joi';


export class ValidaCriacaoUsuarioUseCase {
  constructor(
    @Inject(ISetUserCargo) private readonly setUserCargoService: ISetUserCargo,
    @Inject(IUserService) private readonly userService: IUserService,
    @Inject(IUsuarioPendentes)
    private readonly usuarioPendentesService: IUsuarioPendentes,
  ) { }

  async execute(dto: {
    token: string;
  }): Promise<{ success: boolean, message: string }> {
    const { token } = dto;
    const pendingUser = await this.usuarioPendentesService.get(token);
    if (!pendingUser) {
      return {
        success: false,
        message: 'usuário não encontrado para validar',
      };
    }
    if (await this.userService.validUser(pendingUser)) {
      const user = await this.userService.saveUser(pendingUser);
      //se regex nao for email @ethos.ind.br ele da outro cargo sem ser user
      if (pendingUser.email.includes('@ethos.ind.br')) {
        await this.setUserCargoService.setUserCargo(user, CargoEnum.USER);
      }

      else {
        await this.setUserCargoService.setUserCargo(user, CargoEnum.CATERPILLAR_USER);
      }

      await this.usuarioPendentesService.remove(token);
    }
    return {
      success: true,
      message: 'Seu usuário foi validado e criado com sucesso.',
    };
  }
}