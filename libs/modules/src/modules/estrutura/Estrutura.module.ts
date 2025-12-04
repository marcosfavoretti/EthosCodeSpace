import { Module } from '@nestjs/common';
import { EstruturaServiceModule } from './EstruturaService.module';
import { LogixServiceModule } from '../@logix/LogixService.module';
import { SynecoServiceModule } from '../@syneco/SynecoService.module';
import { RemoveEstruturaUsecase } from './application/RemoveEstrutura.usecase';
import { ConsultarRoteiroUsecase } from './application/ConsultarRoteiro.usecase';
import { GetEstruturaTreePorPartcodeUsecase } from './application/GetEstruturaTreePorPartcode.usecase';
import { ListaEstruturasUsecase } from './application/ListaEstruturas.usecase';
import { ExportEstruturaUsecase } from './application/ExportEstrutura.usecase';
import { GetEstruturasDependentesUsecase } from './application/GetEstruturasDependentes.usecase';
import { GetEstruturaListaPorPartcodeUsecase } from './application/GetEstruturaListaPorPartcode.usecase';

@Module({
  imports: [EstruturaServiceModule, LogixServiceModule],
  providers: [
    ConsultarRoteiroUsecase,
    RemoveEstruturaUsecase,
    GetEstruturaTreePorPartcodeUsecase,
    ListaEstruturasUsecase,
    ExportEstruturaUsecase,
    GetEstruturasDependentesUsecase,
    GetEstruturaListaPorPartcodeUsecase,
    // ConsultaItemDeControleUseCase,
    // GetRequestFileUseCase,
  ],
  exports: [
    ConsultarRoteiroUsecase,
    RemoveEstruturaUsecase,
    GetEstruturaTreePorPartcodeUsecase,
    ListaEstruturasUsecase,
    ExportEstruturaUsecase,
    GetEstruturasDependentesUsecase,
    GetEstruturaListaPorPartcodeUsecase,
    // ConsultaItemDeControleUseCase,
    // GetRequestFileUseCase
  ],
})
export class EstruturaModule {}
