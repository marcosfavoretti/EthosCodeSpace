import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SharedAuthModule } from '@app/modules/shared/modules/SharedAuth.module';
import { PbindexController } from './delivery/pbindex.controller';
import { validate } from './config/env.validation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormMysqlConfig } from '@app/modules/config/TypeormMysqlConfig.module';
import { PowerbiModule } from '@app/modules/modules/powerbi/Powerbi.module';
import { PowerbiDatasets } from '@app/modules/modules/powerbi/@core/entities/PowerbiDatasets.entity';
import { PowerbiAtualizacoes } from '@app/modules/modules/powerbi/@core/entities/PowerbiAtulizacao.entity';
import { PowerBIWebSocket } from './delivery/pbindex.ws';
import { WsUserStoreService } from './@core/service/WsUserStore.service';
import { PowerbiserviceModule } from '@app/modules/modules/powerbi/PowerbiService.module';

@Module({
  imports: [
    PowerbiModule,
    PowerbiserviceModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/pbindex/.env',
      validate,
    }),
    TypeOrmModule.forRootAsync({
      name: 'mysql',
      imports: [ConfigModule],
      useFactory: (c: ConfigService) => typeormMysqlConfig([
        PowerbiDatasets,
        PowerbiAtualizacoes
      ], c),
      inject: [ConfigService],
    }),
    SharedAuthModule.forRoot(),
  ],
  controllers: [PbindexController],
  providers: [
    PowerBIWebSocket,
    WsUserStoreService
  ],
})
export class PbindexModule { }
