import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { EntitySchema, MixedList } from "typeorm";
import { ConfigService } from "@nestjs/config";

export function typeormInformixConfig(entities: MixedList<EntitySchema<any> | Function>, configService: ConfigService): TypeOrmModuleOptions {
    const config: TypeOrmModuleOptions = {
        type: 'oracle',
        logging: false,
        database: configService.get<string>('SQLDATABASE'),
        username: configService.get<string>('SQLUSER'),
        password: configService.get<string>('SQLSENHA'),
        host: configService.get<string>('SQLHOST'),
        entities: entities,
        synchronize: false,
    }
    !entities.length && (Object.assign(config, { name: 'SYNECO_DB' }));
    return config;
}