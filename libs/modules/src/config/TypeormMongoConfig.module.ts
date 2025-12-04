import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EntitySchema, MixedList } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export function typeormMongoConfig(
  entities: MixedList<EntitySchema<any> | Function>,
  configService: ConfigService,
  dtName?: string,
): TypeOrmModuleOptions {
  const config: TypeOrmModuleOptions = {
    name: 'mongo',
    type: 'mongodb',
    logging: true,
    host: configService.get<string>('MONGOHOST'),
    username: configService.get<string>('MONGOUSER'),
    password: configService.get<string>('MONGOPASSWORD'),
    database: configService.get<string>('MONGODATABASE'),
    entities: entities,
    synchronize: false,
  };
  return config;
}
