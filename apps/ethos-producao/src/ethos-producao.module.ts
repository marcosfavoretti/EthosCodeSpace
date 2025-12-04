import { Module } from '@nestjs/common';
import { EthosProducaoController } from './ethos-producao.controller';
import { EthosProducaoService } from './ethos-producao.service';

@Module({
  imports: [],
  controllers: [EthosProducaoController],
  providers: [EthosProducaoService],
})
export class EthosProducaoModule {}
