import { Module } from "@nestjs/common";
import { LogixServiceModule } from "../@logix/LogixService.module";
import { SynecoServiceModule } from "../@syneco/SynecoService.module";
import { ConsultarRoteiroUsecase } from "./application/ConsultarRoteiro.usecase";
import { ExportEstruturaUsecase } from "./application/ExportEstrutura.usecase";
import { GetEstruturaListaPorPartcodeUsecase } from "./application/GetEstruturaListaPorPartcode.usecase";
import { GetEstruturaPorPartcodeUsecase } from "./application/GetEstruturaPorPartcode.usecase";
import { GetEstruturasDependentesUsecase } from "./application/GetEstruturasDependentes.usecase";
import { ListaEstruturasUsecase } from "./application/ListaEstruturas.usecase";
import { RemoveEstruturaUsecase } from "./application/RemoveEstrutura.usecase";
import { ConsultaItensDeControleUsecase } from "./application/ConsultaItensDeControleUsecase";
import { ImagemDaEstruturaUsecase } from "./application/ImagemDaEstruturaUsecase";

@Module({
    imports: [
        LogixServiceModule,
        SynecoServiceModule
    ],
    providers: [
        ConsultaItensDeControleUsecase,
        ConsultarRoteiroUsecase,
        ExportEstruturaUsecase,
        GetEstruturaListaPorPartcodeUsecase,
        GetEstruturaPorPartcodeUsecase,
        GetEstruturasDependentesUsecase,
        ImagemDaEstruturaUsecase,
        ListaEstruturasUsecase,
        RemoveEstruturaUsecase
    ],
    exports: [
        ConsultaItensDeControleUsecase,
        ConsultarRoteiroUsecase,
        ExportEstruturaUsecase,
        GetEstruturaListaPorPartcodeUsecase,
        GetEstruturaPorPartcodeUsecase,
        GetEstruturasDependentesUsecase,
        ImagemDaEstruturaUsecase,
        ListaEstruturasUsecase,
        RemoveEstruturaUsecase
    ]
})
export class EstruturaServiceModule { }