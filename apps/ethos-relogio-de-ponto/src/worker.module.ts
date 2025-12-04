import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WorkerController } from './delivery/worker.controller';
import { validationSchema } from './config/env.validation';
import { RelogioDePontoModule } from '@app/modules/modules/relogio-de-ponto/RelogioDePonto.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Funcionario } from '@app/modules/modules/relogio-de-ponto/@core/entities/Funcionarios.entity';
import { RegistroPonto } from '@app/modules/modules/relogio-de-ponto/@core/entities/RegistroPonto.entity';
import { TipoMarcacaoPonto } from '@app/modules/modules/relogio-de-ponto/@core/entities/TipoMarcacaoPonto.entity';
import { typeormProtheusConfig } from '@app/modules/config/TypeormProtheusConfig.module';
import { typeormOracleConfig } from '@app/modules/config/TypeormOracleConfig.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: 'protheus',
      useFactory: (configService: ConfigService) =>
        typeormProtheusConfig([Funcionario], configService),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      name: 'logix',
      useFactory: (configService: ConfigService) =>
        typeormOracleConfig([RegistroPonto, TipoMarcacaoPonto], configService),
      inject: [ConfigService],
    }),
      ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/ethos-relogio-de-ponto/.env',
      validationSchema,
    }),
    RelogioDePontoModule,
  ],
  controllers: [WorkerController],
  providers: [],
})
export class WorkerModule {}
