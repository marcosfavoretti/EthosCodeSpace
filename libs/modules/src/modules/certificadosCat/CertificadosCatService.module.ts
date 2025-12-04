import { Module } from "@nestjs/common";
import { ProcessadorCertificadoToJson } from "./@core/services/ProcessadorCertificadoToJson.service";
import { CertificadoCatRepository } from "./infra/repository/CertificadoCat.repository";

@Module({
    providers: [
        ProcessadorCertificadoToJson,
        CertificadoCatRepository,
    ],
    exports: [
        CertificadoCatRepository,
        ProcessadorCertificadoToJson
    ]
})
export class CertificadosCatServiceModule {}