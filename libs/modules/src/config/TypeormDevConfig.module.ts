import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormSynecoConfig } from './TypeormSynecoConfig.module';
import { Cargo } from '../modules/user/@core/entities/Cargo.entity';
import { User } from '../modules/user/@core/entities/User.entity';
import { GerenciaCargo } from '../modules/user/@core/entities/GerenciaCargo.entity';

const entities = [User, Cargo, GerenciaCargo];

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        typeormSynecoConfig(entities, configService),
    }),
  ],
  providers: [],
  exports: [TypeOrmModule],
})
export class TypeormDevConfigModule {}
