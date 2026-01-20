import { Module } from '@nestjs/common';
import { PlanejamentoRepository } from './infra/repository/Planejamento.repository';
import { PlanejamentoService } from './infra/service/Planejamento.service';

@Module({
  imports: [],
  providers: [
    PlanejamentoRepository,
    PlanejamentoService,
  ],
  exports: [
    PlanejamentoService,
    PlanejamentoRepository,
  ],
})
export class PlanejamentoServiceModule {}
