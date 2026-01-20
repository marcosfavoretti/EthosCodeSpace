import { Module } from '@nestjs/common';
import { RelogioDePontoServiceModule } from './RelogioDePontoService.module';
import { SincronizaPontosUseCase } from './application/SincronizaPontos.usecase';
import { ConsultaMarcacaoPontosUseCase } from './application/ConsultaPontos.usecase';
import { ProcessaTipoMarcacaoUseCase } from './application/ProcessaTipoMarcacao.usecase';
import { ConsultaFuncionariosUseCase } from './application/ConsultaFuncionarios.usecase';
import { ConsultarCentrodeCustoUseCase } from './application/ConsultarCentroDeCusto.usecase';
import { MaisHorasIrregularesKPIUseCase } from './application/MaisHorasIrregularesKPI.usecase';

@Module({
  imports: [RelogioDePontoServiceModule],
  providers: [
    SincronizaPontosUseCase,
    ProcessaTipoMarcacaoUseCase,
    ConsultaFuncionariosUseCase,
    ConsultarCentrodeCustoUseCase,
    MaisHorasIrregularesKPIUseCase,
    ConsultaMarcacaoPontosUseCase,
  ],
  exports: [
    SincronizaPontosUseCase,
    ConsultarCentrodeCustoUseCase,
    MaisHorasIrregularesKPIUseCase,
    ConsultaFuncionariosUseCase,
    ConsultaMarcacaoPontosUseCase,
    ProcessaTipoMarcacaoUseCase,
  ],
})
export class RelogioDePontoModule { }
