import { ConsultaPorPartcodeReqDTO } from '@app/modules/contracts/dto/ConsultaPorPartcodeReq.dto';
import { ConsultarRoteiroUsecase } from '@app/modules/modules/estrutura/application/ConsultarRoteiro.usecase';
import { Controller, Get, Inject, Query } from '@nestjs/common';

@Controller('roteiro')
export class EstruturaRoteiroController {
  @Inject(ConsultarRoteiroUsecase)
  private consultarRoteiroUsecase: ConsultarRoteiroUsecase;

  @Get('/')
  async consultarRoteiroMethod(
    @Query() dto: ConsultaPorPartcodeReqDTO,
  ): Promise<string[]> {
    return await this.consultarRoteiroUsecase.consultar(dto);
  }
}
