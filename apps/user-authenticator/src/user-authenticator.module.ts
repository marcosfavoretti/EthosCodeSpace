import { ThrottlerModule } from '@nestjs/throttler';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '@app/modules/modules/user/User.module';
import { AuthController } from './auth/auth.controller';
import { UserServiceModule } from '@app/modules/modules/user/UserService.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormSynecoConfig } from '@app/modules/config/TypeormSynecoConfig.module';
import { User } from '@app/modules/modules/user/@core/entities/User.entity';
import { Cargo } from '@app/modules/modules/user/@core/entities/Cargo.entity';
import { GerenciaCargo } from '@app/modules/modules/user/@core/entities/GerenciaCargo.entity';
import { validationSchema } from './config/env.validation';
import { HttpModule } from "@nestjs/axios"
@Module({
  imports: [
    HttpModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    TypeOrmModule.forRootAsync({
      name: 'syneco_database',
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        typeormSynecoConfig([User, Cargo, GerenciaCargo], configService),
      inject: [ConfigService],
    }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    ConfigModule.forRoot({
      envFilePath: 'apps/user-authenticator/.env',
      validationSchema,
      isGlobal: true,
    }),
    UserServiceModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [],
})
export class UserAuthenticatorModule { }
