import { ConfigService } from '@nestjs/config';
import { Neo4jConnection } from 'nest-neo4j/dist';

export function Neo4jConfigModule(configService: ConfigService) {
  const config: Neo4jConnection = {
    scheme: 'neo4j',
    host: configService.get<string>('NEO4JHOST')!,
    port: configService.get<number>('NEO4JPORT')!,
    username: configService.get<string>('NEO4JUSER')!,
    password: configService.get<string>('NEO4JPASS')!,
    database: configService.get<string>('NEO4JDATABASE')!,
  };
  return config;
}
