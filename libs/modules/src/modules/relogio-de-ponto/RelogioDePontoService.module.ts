import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComputaMarcacaoService } from './infra/services/ComputaMarcacao.service';
import { SincronizaRelogioPorArquivoService } from './infra/services/SincronizaRelogioPorArquivo.service';
import { SincronizaRelogioService } from './infra/services/SincronizaRelogio.service';
import { SincronizadorFactory } from './infra/services/SincronizadorFactory.service';
import { Funcionario } from './@core/entities/Funcionarios.entity';
import { RegistroPonto } from './@core/entities/RegistroPonto.entity';
import { TipoMarcacaoPonto } from './@core/entities/TipoMarcacaoPonto.entity';
import { FuncinarioRepository } from './infra/repository/Funcionario.repository';
import { RegistroPontoRepository } from './infra/repository/RegistroPonto.repository';
import { TipoMarcacaoPontoRepository } from './infra/repository/TipoMarcacaoPonto.repository';
import { CentroDeCustoRepository } from './infra/repository/CentroDeCusto.repository';
import { CheckInvalidHours } from './@core/services/CheckInvalidHours';

const protheusTypeOrm = TypeOrmModule.forFeature([Funcionario], 'protheus');

const logixTypeOrm = TypeOrmModule.forFeature(
  [RegistroPonto, TipoMarcacaoPonto],
  'logix',
);

@Module({
  imports: [protheusTypeOrm, logixTypeOrm],
  providers: [
    CheckInvalidHours,
    SincronizaRelogioService,
    CentroDeCustoRepository,
    SincronizaRelogioPorArquivoService,
    SincronizadorFactory,
    TipoMarcacaoPontoRepository,
    FuncinarioRepository,
    RegistroPontoRepository,
    ComputaMarcacaoService,
  ],
  exports: [
    CentroDeCustoRepository,
    protheusTypeOrm,
    TipoMarcacaoPontoRepository,
    FuncinarioRepository,
    CheckInvalidHours,
    RegistroPontoRepository,
    logixTypeOrm,
    ComputaMarcacaoService,
    SincronizaRelogioPorArquivoService,
    SincronizaRelogioService,
    SincronizadorFactory,
  ],
})
export class RelogioDePontoServiceModule {}
