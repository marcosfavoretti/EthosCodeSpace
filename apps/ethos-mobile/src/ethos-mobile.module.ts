import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validate } from './config/env.validation';
import { MobileImpressoraController } from './delivery/MobileImpressoras.controller';
import { ImpressoraBluetoothModule } from '@app/modules/modules/impressora-bluetooth/ImpressoraBluetooth.module';
import { typeormSynecoConfig } from '@app/modules/config/TypeormSynecoConfig.module';
import { ImpressoraBluetooth } from '@app/modules/modules/impressora-bluetooth/@core/entities/impressora-bluetooth.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MobileEtiquetasController } from './delivery/MobileEtiquetas.controller';
import { EtiquetasModule } from '@app/modules/modules/etiquetas/Etiquetas.module';
import { Production } from '@app/modules/modules/@syneco/@core/entities/Production.entity';
import { ProductionData } from '@app/modules/modules/@syneco/@core/entities/ProductionData.entity';
import { ItemXQtdSemana } from '@app/modules/modules/@syneco/@core/entities/ItemXQtdSemana.entity';
import { PartSerialNumber } from '@app/modules/modules/@syneco/@core/entities/PartSerialNumber.entity';
import { PartSerialNumberProduction } from '@app/modules/modules/@syneco/@core/entities/PartSerialNumberProduction.entity';
import { LabelPDI } from '@app/modules/modules/etiquetas/@core/entities/LabelPDI.entity';
import { GaleriaFotosModule } from '@app/modules/modules/galeria_fotos/GaleriaFotos.module';
import { typeormMongoConfig } from '@app/modules/config/TypeormMongoConfig.module';
import { ImagemPack } from '@app/modules/modules/galeria_fotos/@core/entities/ImagemPack.entity';
import { MobileGaleriaController } from './delivery/MobileGaleria.controller';
import { RnVersionModule } from '@app/modules/modules/rn_version/RnVersion.module';
import { typeormMysqlConfig } from '@app/modules/config/TypeormMysqlConfig.module';
import { MobileVersionController } from './delivery/MobileVersion.controller';
import { ReactNativeAppVersion } from '@app/modules/modules/rn_version/@core/entities/ReactNativeAppVersion.entity';
import { ReportQualidade } from '@app/modules/modules/galeria_fotos/@core/entities/PerguntaParaQualidade.entity';
import { QualidadeImagens } from '@app/modules/modules/galeria_fotos/@core/entities/QualidadeImagens.entity';

const entities = [
  ImpressoraBluetooth,
  Production,
  ProductionData,
  ItemXQtdSemana,
  LabelPDI,
  PartSerialNumber,
  PartSerialNumberProduction,
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
      envFilePath: 'apps/ethos-mobile/.env',
    }),
    TypeOrmModule.forRootAsync({
      name: 'mysql',
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        typeormMysqlConfig(
          [ReportQualidade, QualidadeImagens, ReactNativeAppVersion],
          configService,
        ),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      name: 'syneco_database',
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        typeormSynecoConfig(entities, configService),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      name: 'mongo',
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        typeormMongoConfig([ImagemPack], configService),
      inject: [ConfigService],
    }),
    RnVersionModule,
    GaleriaFotosModule,
    EtiquetasModule,
    ImpressoraBluetoothModule,
  ],
  controllers: [
    MobileVersionController,
    MobileImpressoraController,
    MobileGaleriaController,
    MobileEtiquetasController,
  ],
  providers: [],
})
export class EthosMobileModule {}
