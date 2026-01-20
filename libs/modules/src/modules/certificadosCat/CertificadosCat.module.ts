import { Module } from '@nestjs/common';
import { CertificadosCatServiceModule } from './CertificadosCatService.module';
import { ProcessaCertificadoUseCase } from './application/ProcessaCertificado.usecase';
import { ConsultaCertificadosUseCase } from './application/ConsultaCertificados.usecase';
import { ConsultaCertificadoTXTUsecase } from './application/ConsultaCertificadoTXT.usecase';
import { ReprocessaCertificadoUseCase } from './application/ReprocessaCertificado.usecase';

@Module({
  imports: [CertificadosCatServiceModule],
  providers: [
    ReprocessaCertificadoUseCase,
    ProcessaCertificadoUseCase,
    ConsultaCertificadoTXTUsecase,
    ConsultaCertificadosUseCase,
  ],
  exports: [
    ReprocessaCertificadoUseCase,
    ProcessaCertificadoUseCase,
    ConsultaCertificadoTXTUsecase,
    ConsultaCertificadosUseCase,
  ],
})
export class CertificadosCatModule {}
