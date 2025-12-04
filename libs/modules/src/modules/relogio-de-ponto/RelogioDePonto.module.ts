import { Module } from '@nestjs/common';
import { RelogioDePontoServiceModule } from './RelogioDePontoService.module';
import { SincronizaPontosUseCase } from './application/SincronizaPontos.usecase';
import { ConsultaMarcacaoPontosUseCase } from './application/ConsultaPontos.usecase';
import { ProcessaTipoMarcacaoUseCase } from './application/ProcessaTipoMarcacao.usecase';
import { ConsultaFuncionariosUseCase } from './application/ConsultaFuncionarios.usecase';

@Module({
  imports: [RelogioDePontoServiceModule],
  providers: [
    SincronizaPontosUseCase,
    ProcessaTipoMarcacaoUseCase,
    ConsultaFuncionariosUseCase,
    ConsultaMarcacaoPontosUseCase,
  ],
  exports: [
    SincronizaPontosUseCase,
    ConsultaFuncionariosUseCase,
    ConsultaMarcacaoPontosUseCase,
    ProcessaTipoMarcacaoUseCase,
  ],
})
export class RelogioDePontoModule {}
