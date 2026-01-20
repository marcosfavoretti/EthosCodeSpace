import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../@core/entities/User.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserNotFoundException } from '../../@core/exceptions/UserNotFound.exception';
import { AutenticationService } from './Autentication.service';
import { plainToInstance } from 'class-transformer';
import { IUserService } from '../../@core/interfaces/IUserService';
import { IAutentication } from '../../@core/interfaces/IAutentication';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService implements IUserService {
  private authService: IAutentication;

  constructor(
    private configService: ConfigService,
    @InjectRepository(User, 'syneco_database')
    private userRepo: Repository<User>,
  ) {
    this.authService = new AutenticationService(this.userRepo);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async systemAuth(): Promise<User> {
    try {
      return await this.userRepo.findOneOrFail({
        where: {
          id: this.configService.get('SYSTEM_USER_ID'),
        },
      });
    } catch (error) {
      throw new Error('nao foi possível autenticar o sistema');
    }
  }

  async auth(auth: { user: string; password: string }): Promise<User> {
    try {
      return await this.authService.auth(auth.user, auth.password);
    } catch (error) {
      if (error instanceof UserNotFoundException)
        throw new UnauthorizedException('Usuario ou senha inválidos');
      throw error;
    }
  }

  async validUser(userdto: User): Promise<boolean> {
    return !(
      (await this.userRepo.existsBy({
        name: userdto.name,
      })) ||
      (await this.userRepo.existsBy({
        email: userdto.email,
      })) ||
      //valida se o dominio do email é @ethos.ind.br ou @caterpillar.com
      (!userdto.email.includes('@ethos.ind.br') &&
        !userdto.email.includes('@cat.com'))
    );
  }

  async getUser(idUser: string): Promise<User> {
    if (!idUser) throw new UserNotFoundException();
    const user = await this.userRepo.findOne({
      where: {
        id: idUser,
      },
    });
    if (!user) throw new UserNotFoundException();
    return plainToInstance(User, user);
  }

  async saveUser(user: User): Promise<User> {
    const userObj = this.userRepo.create(user);
    const newUser = await this.userRepo.save(userObj);
    return newUser;
  }

  async guestAutentication(name: string): Promise<User> {
    return this.authService.authWeakness(name);
  }
}
