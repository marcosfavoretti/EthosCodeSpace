import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EntitySchema, MixedList } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export function typeormProtheusConfig(
  entities: MixedList<EntitySchema<any> | Function>,
  configService: ConfigService,
): TypeOrmModuleOptions {
  const config: TypeOrmModuleOptions = {
    type: 'oracle',
    name: 'protheus',
    logging: true,
    sid: configService.get<string>('PROTHEUSSID'),
    username: configService.get<string>('PROTHEUSUSER'),
    password: configService.get<string>('PROTHEUSPASSWORD'),
    host: configService.get<string>('PROTHEUSHOST'),
    entities: entities,
    synchronize: false,
  };
  !entities.length && Object.assign(config, { name: 'SYNECO_DB' });
  return config;
}
