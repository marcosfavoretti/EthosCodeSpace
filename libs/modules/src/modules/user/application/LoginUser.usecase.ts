import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtHandler } from '../infra/service/JwtHandler';
import { IUserService } from '../@core/interfaces/IUserService';
import { AuthDto } from '@app/modules/contracts/dto/Auth.dto';
import { User } from '../@core/entities/User.entity';
import { AutenticationService } from '../infra/service/Autentication.service';
import { UserResponseDTO } from '@app/modules/contracts/dto/ResUser.dto';
import { UserNotFoundException } from '../@core/exceptions/UserNotFound.exception';

@Injectable()
export class LoginUserUsecase {
  constructor(
    @Inject(AutenticationService)
    private autenticationService: AutenticationService,
    @Inject(IUserService) private userService: IUserService,
    private jwtGen: JwtHandler,
  ) { }

  async login(dto: AuthDto): Promise<string> {
    try {
      const user = await this.autenticationService.auth(dto.user, dto.password);
      const userObject = UserResponseDTO.fromEntity(user);
      return this.jwtGen.generateToken(userObject);
    } catch (error) {
      Logger.error(error)
      if (error instanceof UnauthorizedException) throw error;
      if (error instanceof UserNotFoundException) throw error;
        throw new InternalServerErrorException(
          'problemas ao efetuar o login'
        );
    }
  }

  async loginAsGuest(dto: { name: string }): Promise<User> {
    return await this.userService.guestAutentication(dto.name);
  }
}
