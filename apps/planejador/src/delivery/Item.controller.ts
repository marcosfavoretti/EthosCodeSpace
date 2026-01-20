import { ConsultarTabelaCapabilidadeDTO } from '@app/modules/contracts/dto/ConsultarTabelaCapabilidade.dto';
import { CadastrarItemCapabilidadeUseCase } from '@app/modules/modules/planejador/application/CadastrarCapabilidade.usecase';
import { ConsultarItemCapabilidadeTabelaUseCase } from '@app/modules/modules/planejador/application/ConsultarItemCapabilidadeTabela.usecase';
import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

@Controller('item')
export class ItemController {
  @Inject(ConsultarItemCapabilidadeTabelaUseCase)
  private consultarItemCapabilidadeTabelaUseCase: ConsultarItemCapabilidadeTabelaUseCase;
  @ApiResponse({
    type: () => ConsultarTabelaCapabilidadeDTO,
    isArray: true,
  })
  @Get('capabiliade')
  async getItemCapabilildadeMethod(): Promise<
    ConsultarTabelaCapabilidadeDTO[]
  > {
    return await this.consultarItemCapabilidadeTabelaUseCase.consultar();
  }

  @Inject(CadastrarItemCapabilidadeUseCase)
  private cadastrarItemCapabilidadeUseCase: CadastrarItemCapabilidadeUseCase;
  @Post('/capabilidade')
  async cadastrarItemCapabilidadeMethod(
    @Body() payload: ConsultarTabelaCapabilidadeDTO,
  ): Promise<void> {
    return await this.cadastrarItemCapabilidadeUseCase.cadastrar(payload);
  }
}
