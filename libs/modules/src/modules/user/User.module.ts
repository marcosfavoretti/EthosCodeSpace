import { Module } from '@nestjs/common';
import { UserServiceModule } from './UserService.module';
import { CargosServiceModule } from './CargoService.module';
import { CreateUserUsecase } from './application/CreateUser.usecase';
import { DetailUserUsecase } from './application/DetailUser.usecase';
import { LoginUserUsecase } from './application/LoginUser.usecase';
import { CheckUserTokenUsecase } from './application/CheckUserToken.usecase';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './infra/strategy/jwt.strategy';
import { JwtHandler } from './infra/service/JwtHandler';
import { JwtGuard } from '../../shared/guards/jwt.guard';
import { ValidaCriacaoUsuarioUseCase } from './application/ValidaCriacaoUsuario.usecase';
import { EmailHttpClient } from '@app/modules/contracts/clients/EmailHttp.client';
import { IOnUserCreated } from './@core/interfaces/IOnUserCreated';
import { EmailDeValidacaoService } from './infra/service/EmailDeValidacao.service';

@Module({
  imports: [
    UserServiceModule,
    CargosServiceModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      global: true,
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET'),
        signOptions: {
          expiresIn: parseInt(
            configService.get<string>('EXPIREHOURS') || '3600',
            10,
          ),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    EmailHttpClient,
    EmailDeValidacaoService,
    {
      provide: IOnUserCreated,
      useFactory: (emailVal: IOnUserCreated) => [emailVal],
      inject: [EmailDeValidacaoService],
    },
    CreateUserUsecase,
    DetailUserUsecase,
    LoginUserUsecase,
    CheckUserTokenUsecase,
    JwtStrategy,
    JwtHandler,
    ValidaCriacaoUsuarioUseCase,
    JwtGuard,
  ],
  exports: [
    ValidaCriacaoUsuarioUseCase,
    CreateUserUsecase,
    DetailUserUsecase,
    LoginUserUsecase,
    CheckUserTokenUsecase,
    JwtStrategy,
    JwtHandler,
    JwtGuard,
  ],
})
export class UserModule { }
