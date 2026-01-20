import { Module } from '@nestjs/common';
import { ItemServiceModule } from './ItemService.module';
import { ConsultarItemCapabilidadeTabelaUseCase } from './application/ConsultarItemCapabilidadeTabela.usecase';
import { CadastrarItemCapabilidadeUseCase } from './application/CadastrarCapabilidade.usecase';
import { SetorServiceModule } from './SetorService.module';

@Module({
  imports: [ItemServiceModule, SetorServiceModule],
  providers: [
    CadastrarItemCapabilidadeUseCase,
    ConsultarItemCapabilidadeTabelaUseCase,
  ],
  exports: [
    CadastrarItemCapabilidadeUseCase,
    ConsultarItemCapabilidadeTabelaUseCase,
  ],
})
export class ItemModule {}
