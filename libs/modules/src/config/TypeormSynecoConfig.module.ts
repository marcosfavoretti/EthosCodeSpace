import {  TypeOrmModuleOptions } from "@nestjs/typeorm";
import { EntitySchema, MixedList } from "typeorm";
import { ConfigService } from "@nestjs/config";

export function typeormSynecoConfig(entities: MixedList<EntitySchema<any> | Function>, configService: ConfigService): TypeOrmModuleOptions {
    const config: TypeOrmModuleOptions = {
        type: 'mssql',
        logging: false,
        database: configService.get<string>('SQLDATABASE'),
        username: configService.get<string>('SQLUSER'),
        password: configService.get<string>('SQLSENHA'),
        host: configService.get<string>('SQLHOST'),
        entities: entities,
        synchronize: false,
        options: {
            trustServerCertificate: true,
            encrypt: true,
        }
    }
    !entities.length && (Object.assign(config, { name: 'SYNECO_DB' }));
    return config;
}