import { Module } from '@nestjs/common';
import { SaveBufferInHistUseCase } from './application/SaveBufferInHist.usecase';
import { ListItensAtivosUseCase } from './application/ListItensAtivos.usecase';
import { BufferServiceModule } from './BufferService.module';
import { ConsultaSetoresUseCase } from './application/ConsultaSetores.usecase';
import { ConsultarMercadoUseCase } from './application/ConsultaMercados.usecase';
import { JobCriacaoTabelaUseCase } from './application/JobCriacaoTabela.usecase';
import { SynecoServiceModule } from '../@syneco/SynecoService.module';
import { ConsultarBufferCompactadoUseCase } from './application/ConsultarBufferCompactado.usecase';
import { AdicionarNoExcelUseCase } from './application/AdicionarNoExcel.usecase';
import { StorageModule } from '../storage/Storage.module';

@Module({
  imports: [BufferServiceModule, SynecoServiceModule, StorageModule],
  providers: [
    SaveBufferInHistUseCase,
    ListItensAtivosUseCase,
    ConsultaSetoresUseCase,
    AdicionarNoExcelUseCase,
    JobCriacaoTabelaUseCase,
    ConsultarMercadoUseCase,
    ConsultarBufferCompactadoUseCase,
  ],
  exports: [
    JobCriacaoTabelaUseCase,
    ConsultaSetoresUseCase,
    AdicionarNoExcelUseCase,
    ConsultarMercadoUseCase,
    ConsultarBufferCompactadoUseCase,
    ListItensAtivosUseCase,
    SaveBufferInHistUseCase,
  ],
})
export class BufferModule {}
