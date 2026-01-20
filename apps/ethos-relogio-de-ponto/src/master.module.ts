import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PROCESSA_PONTO_QUEUE, PROCESSA_WORKER } from './@core/symbols/symbols';
import { validationSchema } from './config/env.validation';
import { RelogioDePontoModule } from '@app/modules/modules/relogio-de-ponto/RelogioDePonto.module';
import { SincronizacaoPollingService } from './cronn/SincronizacaoPolling.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormProtheusConfig } from '@app/modules/config/TypeormProtheusConfig.module';
import { Funcionario } from '@app/modules/modules/relogio-de-ponto/@core/entities/Funcionarios.entity';
import { typeormOracleConfig } from '@app/modules/config/TypeormOracleConfig.module';
import { RegistroPonto } from '@app/modules/modules/relogio-de-ponto/@core/entities/RegistroPonto.entity';
import { TipoMarcacaoPonto } from '@app/modules/modules/relogio-de-ponto/@core/entities/TipoMarcacaoPonto.entity';
import { RelogioDePontoServiceModule } from '@app/modules/modules/relogio-de-ponto/RelogioDePontoService.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CentroDeCusto } from '@app/modules/modules/relogio-de-ponto/@core/entities/CentroDeCusto.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    RelogioDePontoServiceModule,
    RelogioDePontoModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/ethos-relogio-de-ponto/.env',
      validationSchema,
    }),
    TypeOrmModule.forRootAsync({
      name: 'protheus',
      useFactory: (configService: ConfigService) =>
        typeormProtheusConfig([Funcionario, CentroDeCusto], configService),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      name: 'logix',
      useFactory: (configService: ConfigService) =>
        typeormOracleConfig([RegistroPonto, TipoMarcacaoPonto], configService),
      inject: [ConfigService],
    }),
    ClientsModule.registerAsync([
      {
        name: PROCESSA_WORKER,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL')!],
            queue: PROCESSA_PONTO_QUEUE,
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [SincronizacaoPollingService],
})
export class MasterModule {}
