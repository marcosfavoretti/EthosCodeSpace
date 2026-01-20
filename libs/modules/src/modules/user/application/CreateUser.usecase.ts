import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserBuilder } from '../@core/builder/User.builder';
import { IUserService } from '../@core/interfaces/IUserService';
import { CreateUserDto } from '@app/modules/contracts/dto/CreateUser.dto';
import { IUsuarioPendentes } from '../@core/interfaces/IUsuarioPendentes';
import { randomUUID } from 'crypto';
import { IOnUserCreated } from '../@core/interfaces/IOnUserCreated';

@Injectable()
export class CreateUserUsecase {
  
  constructor(
    @Inject(IUsuarioPendentes) private usuarioPendentesRepository: IUsuarioPendentes,
    @Inject(IUserService) private userService: IUserService,
    @Inject(IOnUserCreated) private onUserCreated: IOnUserCreated[],
  ) { }

  async execute(dto: CreateUserDto): Promise<string> {
    try {
      const user = new UserBuilder()
        .withPassword(dto.password)
        .withEmail(dto.email)
        .withName(dto.name)
        .build();

      if (await this.userService.validUser(user)) {
        const code = randomUUID();
        await this.usuarioPendentesRepository.add(code, user),
          Promise.all([
            this.onUserCreated.map(event =>
              event
                .oncreate({ user, code }))
          ]);
        return code;
      }
      
      throw new Error('usuario inválido, nome ou email já existe');
    } catch (error) {
      throw new BadRequestException(
        'não foi possivel criar usuario!',
        error.message,
      );
    }
  }
}
