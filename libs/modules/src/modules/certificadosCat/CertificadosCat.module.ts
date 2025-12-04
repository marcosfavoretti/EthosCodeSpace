import { Module } from "@nestjs/common";
import { CertificadosCatServiceModule } from "./CertificadosCatService.module";
import { ProcessaCertificadoUseCase } from "./application/ProcessaCertificado.usecase";
import { ConsultaCertificadosUseCase } from "./application/ConsultaCertificados.usecase";
import { ConsultaCertificadoTXTUsecase } from "./application/ConsultaCertificadoTXT.usecase";

@Module({
    imports: [CertificadosCatServiceModule],
    providers: [ProcessaCertificadoUseCase, ConsultaCertificadoTXTUsecase, ConsultaCertificadosUseCase],
    exports: [ProcessaCertificadoUseCase, ConsultaCertificadoTXTUsecase, ConsultaCertificadosUseCase]
})
export class CertificadosCatModule { }