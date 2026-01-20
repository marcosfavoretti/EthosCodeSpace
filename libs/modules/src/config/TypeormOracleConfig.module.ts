import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EntitySchema, MixedList } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export function typeormOracleConfig(
  entities: MixedList<EntitySchema<any> | Function>,
  configService: ConfigService,
): TypeOrmModuleOptions {
  const config: TypeOrmModuleOptions = {
    type: 'oracle',
    name: 'logix',
    logging: false,
    useUTC: true,
    extra: {
      sessionTimezone: 'UTC',
    },
    sid: configService.get<string>('ORACLESID'),
    username: configService.get<string>('ORACLEUSER'),
    password: configService.get<string>('ORACLEPASSWORD'),
    host: configService.get<string>('ORACLEHOST'),
    entities: entities,
    synchronize: false,
  };
  !entities.length && Object.assign(config, { name: 'SYNECO_DB' });
  return config;
}
