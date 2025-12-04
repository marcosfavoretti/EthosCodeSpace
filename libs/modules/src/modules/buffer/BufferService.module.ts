import { Module } from '@nestjs/common';
import { BufferHistoricoRepository } from './infra/repository/BufferHistorico.repository';
import { ConsutlarItensAtivosService } from './infra/service/ConsultarItensAtivos.service';
import { GerenciaBuffersService } from './infra/service/GerenciaBuffers.service';
import { ConsultaSetoresService } from './infra/service/ConsultaSetores.service';
import { ConsultaMercadoService } from './infra/service/ConsultarMercado.service';
import { SetoresRepository } from './infra/repository/Setores.repository';
import { MercadosIntermediarioRepository } from './infra/repository/MercadosIntermediario.repository';
import { JobCriacaoTabelaUseCase } from './application/JobCriacaoTabela.usecase';
import { ItemQtdSemanaComBufferRepository } from './infra/repository/ItemQtdSemanaComBuffer.repository';
import { CompactBufferDataService } from './infra/service/CompactBufferData.service';
import { ExcelService } from './infra/service/Excel.service';

@Module({
  imports: [],
  providers: [
    SetoresRepository,
    CompactBufferDataService,
    MercadosIntermediarioRepository,
    ConsultaSetoresService,
    ConsultaMercadoService,
    BufferHistoricoRepository,
    ExcelService,
    ConsutlarItensAtivosService,
    GerenciaBuffersService,
    ItemQtdSemanaComBufferRepository,
    JobCriacaoTabelaUseCase,
  ],
  exports: [
    ExcelService,
    ConsultaSetoresService,
    CompactBufferDataService,
    ItemQtdSemanaComBufferRepository,
    ConsultaMercadoService,
    JobCriacaoTabelaUseCase,
    ConsutlarItensAtivosService,
    GerenciaBuffersService,
    BufferHistoricoRepository,
  ],
})
export class BufferServiceModule {}
