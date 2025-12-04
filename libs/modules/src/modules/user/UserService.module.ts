import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IUserService } from './@core/interfaces/IUserService';
import { User } from './@core/entities/User.entity';
import { UserService } from './infra/service/User.service';
import { JwtHandler } from './infra/service/JwtHandler';
import { ConfigModule } from '@nestjs/config';
import { AutenticationService } from './infra/service/Autentication.service';
import { IUsuarioPendentes } from './@core/interfaces/IUsuarioPendentes';
import { UsuarioPendentesMemoriaRepository } from './infra/repository/UsuarioPendentesMemoria.repository';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([User], 'syneco_database')],
  providers: [
    {
      provide: IUsuarioPendentes,
      useClass: UsuarioPendentesMemoriaRepository
    },
    {
      provide: IUserService,
      useClass: UserService,
    },
    JwtHandler,
    AutenticationService,
  ],
  exports: [AutenticationService, IUserService, IUsuarioPendentes],
})
export class UserServiceModule { }
