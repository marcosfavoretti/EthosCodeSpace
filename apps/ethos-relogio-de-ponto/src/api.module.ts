import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PontoController } from './delivery/Ponto.controller';
import { PROCESSA_PONTO_QUEUE, PROCESSA_WORKER } from './@core/symbols/symbols';
import { validationSchema } from './config/env.validation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormProtheusConfig } from '@app/modules/config/TypeormProtheusConfig.module';
import { Funcionario } from '@app/modules/modules/relogio-de-ponto/@core/entities/Funcionarios.entity';
import { RelogioDePontoServiceModule } from '@app/modules/modules/relogio-de-ponto/RelogioDePontoService.module';
import { typeormOracleConfig } from '@app/modules/config/TypeormOracleConfig.module';
import { RegistroPonto } from '@app/modules/modules/relogio-de-ponto/@core/entities/RegistroPonto.entity';
import { TipoMarcacaoPonto } from '@app/modules/modules/relogio-de-ponto/@core/entities/TipoMarcacaoPonto.entity';
import { RelogioDePontoModule } from '@app/modules/modules/relogio-de-ponto/RelogioDePonto.module';

@Module({
  imports: [
    RelogioDePontoServiceModule,
    RelogioDePontoModule,
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
  controllers: [PontoController],
  providers: [],
})
export class ApiModule {}
