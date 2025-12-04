import { User } from '../../@core/entities/User.entity';
import { Repository } from 'typeorm';
import { UserNotFoundException } from '../../@core/exceptions/UserNotFound.exception';
import { IAutentication } from '../../@core/interfaces/IAutentication';
import { InjectRepository } from '@nestjs/typeorm';

export class AutenticationService implements IAutentication {
  constructor(
    @InjectRepository(User, 'syneco_database')
    private userRepo: Repository<User>,
  ) {}

  async auth(username: string, password: string): Promise<User> {
    const targetUser = await this.userRepo.findOne({
      where: {
        name: username,
      },
      relations: {
        cargos: {
          user: false,
          cargo: true,
        }
      }
    });

    if (!targetUser) {
      throw new UserNotFoundException();
    }
    const isPasswordValid = await targetUser.validatePassword(password);

    if (!isPasswordValid) {
      throw new UserNotFoundException();
    }

    return targetUser;
  }

  async authWeakness(userName: string): Promise<User> {
    const targetUser = await this.userRepo.findOne({
      where: {
        name: userName,
        password: 'guest',
      },
    });
    if (!targetUser) throw new UserNotFoundException();
    return targetUser;
  }
}
