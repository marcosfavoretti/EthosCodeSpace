import { Module } from '@nestjs/common';
import { PlanejamentoServiceModule } from './PlanejamentoService.module';

@Module({
  imports: [PlanejamentoServiceModule],
  providers: [],
  exports: [],
})
export class PlanejamentoModule {}
