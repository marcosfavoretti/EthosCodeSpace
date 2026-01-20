import { Module } from "@nestjs/common";
import { AppEthosServiceModule } from "./AppEthosService.module";
import { ConsultaRotasDoUsuarioUsecase } from "./application/ConsultaRotasDoUsuario.usecase";
import { DeletaRotaUseCase } from "./application/DeletaRota.usecase";
import { AtualizaRotaUseCase } from "./application/AtualizaRota.usecase";
import { CriaRotaUseCase } from "./application/CriaRota.usecase";

@Module({
    imports: [AppEthosServiceModule],
    providers: [
        ConsultaRotasDoUsuarioUsecase,
        DeletaRotaUseCase,
        AtualizaRotaUseCase,
        CriaRotaUseCase
    ],
    exports: [
        ConsultaRotasDoUsuarioUsecase,
        DeletaRotaUseCase,
        AtualizaRotaUseCase,
        CriaRotaUseCase
    ],
})
export class AppEthosModule { }