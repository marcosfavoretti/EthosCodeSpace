import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EntitySchema, MixedList } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export function typeormMysqlConfig(
  entities: MixedList<EntitySchema<any> | Function>,
  configService: ConfigService,
  dtName?: string,
): TypeOrmModuleOptions {
  const config: TypeOrmModuleOptions = {
    type: 'mysql',
    logging: false,
    database: configService.get<string>('MYSQLDATABASE'),
    username: configService.get<string>('MYSQLUSER'),
    password: configService.get<string>('MYSQLSENHA'),
    host: configService.get<string>('MYSQLHOST'),
    entities: entities,
    synchronize: false,
  };
  return config;
}
