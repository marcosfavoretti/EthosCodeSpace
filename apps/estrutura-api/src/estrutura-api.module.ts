import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EstruturaController } from './delivery/Estrutura.controller';
import { EstruturaModule } from '@app/modules/modules/estrutura/Estrutura.module';
import { EstruturaServiceModule } from '@app/modules/modules/estrutura/EstruturaService.module';
import { typeormOracleConfig } from '@app/modules/config/TypeormOracleConfig.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from '@app/modules/modules/@logix/@core/entities/Item.entity';
import { Neo4jConfigModule } from '@app/modules/config/Neo4jConfig.module';
import { Neo4jModule } from 'nest-neo4j/dist';
import { typeormSynecoConfig } from '@app/modules/config/TypeormSynecoConfig.module';
import { ItemXQtdSemana } from '@app/modules/modules/@syneco/@core/entities/ItemXQtdSemana.entity';
import { EstruturaImagemController } from './delivery/EstruturaImagem.controller';
import { EstruturaRoteiroController } from './delivery/EstruturaRoteiro.controller';
import { ItemMan } from '@app/modules/modules/@logix/@core/entities/ItemMan.entity';
import { ManProcessoItem } from '@app/modules/modules/@logix/@core/entities/ManProcessoItem.entity';
import { EstruturaExportController } from './delivery/EstruturaExport.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'apps/estrutura-api/.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      name: 'mongo',
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        typeormOracleConfig([Item], configService),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      name: 'logix',
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        typeormOracleConfig([ItemMan, ManProcessoItem], configService),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      name: 'syneco_database',
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        typeormSynecoConfig([ItemXQtdSemana], configService),
      inject: [ConfigService],
    }),
    Neo4jModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        Neo4jConfigModule(configService),
    }),
    EstruturaServiceModule,
    EstruturaModule,
  ],
  controllers: [
    EstruturaController,
    EstruturaExportController,
    EstruturaRoteiroController,
    EstruturaImagemController,
  ],
  providers: [],
})
export class EstruturaApiModule {}
