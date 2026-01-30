import { ResMercadosIntermediarioDoSetorDTO } from '@app/modules/contracts/dto/ResMercadosDoSetor.dto';
import { ResSetorDTO } from '@app/modules/contracts/dto/ResSetores.dto';
import { ConsultarMercadoUseCase } from '@app/modules/modules/buffer/application/ConsultaMercados.usecase';
import { ConsultaSetoresUseCase } from '@app/modules/modules/buffer/application/ConsultaSetores.usecase';
import { Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

@Controller('/setores')
export class SetoresController {
  @Inject(ConsultaSetoresUseCase) setoresUseCase: ConsultaSetoresUseCase;
  @ApiResponse({
    status: 200,
    type: () => ResSetorDTO,
    isArray: true,
  })
  @Get('/')
  async getSetoresMethod(): Promise<ResSetorDTO[]> {
    return await this.setoresUseCase.consultaTodos();
  }

  @Inject(ConsultarMercadoUseCase)
  private consultarMercadoUseCase: ConsultarMercadoUseCase;
  @ApiResponse({
    status: 200,
    type: () => ResMercadosIntermediarioDoSetorDTO,
    isArray: true,
  })
  @Get('/:setorId/mercados/:dia')
  async getSetorMercadoMethod(
    @Param('setorId') setorId: number,
    @Param('dia') dia: string,
  ): Promise<ResMercadosIntermediarioDoSetorDTO[]> {
    return await this.consultarMercadoUseCase.consulta({ dia, setorId });
  }
}
