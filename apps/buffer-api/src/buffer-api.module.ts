import { Module } from '@nestjs/common';
import { BufferServiceModule } from 'libs/modules/src/modules/buffer/BufferService.module';
import { BufferController } from './delivery/Buffer.controller';
import { SetoresController } from './delivery/Setores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Production } from '@app/modules/modules/@syneco/@core/entities/Production.entity';
import { ProductionData } from '@app/modules/modules/@syneco/@core/entities/ProductionData.entity';
import { BufferHistorico } from '@app/modules/modules/buffer/@core/entities/BufferHistorico.entity';
import { ItemXQtdSemanaComBuffer } from '@app/modules/modules/buffer/@core/entities/ItemQtdSemana.entity';
import { MercadosIntermediario } from '@app/modules/modules/buffer/@core/entities/MercadosIntermediarios.entity';
import { Setores } from '@app/modules/modules/buffer/@core/entities/Setores.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { typeormSynecoConfig } from '@app/modules/config/TypeormSynecoConfig.module';
import { BufferModule } from '@app/modules/modules/buffer/Buffer.module';
import { ExcelController } from './delivery/Excel.controller';

const entities = [
  Production,
  ProductionData,
  Buffer,
  BufferHistorico,
  ItemXQtdSemanaComBuffer,
  MercadosIntermediario,
  Setores,
];

@Module({
  imports: [
    BufferModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/buffer-api/.env',
    }),
    TypeOrmModule.forRootAsync({
      name: 'syneco_database',
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        typeormSynecoConfig(entities, configService),
      inject: [ConfigService],
    }),
  ],
  controllers: [BufferController, SetoresController, ExcelController],
  providers: [],
})
export class BufferApiModule {}
