import { ConsultarGanttDTO } from '@app/modules/contracts/dto/ConsultarGantt.dto';
import { GetGanttInformationDto } from '@app/modules/contracts/dto/GetGanttInformation.dto';
import { ConsultarGraficoGanttUseCase } from '@app/modules/modules/planejador/application/ConsultarGraficoGantt.usecase';
import { JwtGuard } from '@app/modules/shared/guards/jwt.guard';
import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@UseGuards(JwtGuard)
@Controller('kpi')
export class KPIController {
  @Inject(ConsultarGraficoGanttUseCase)
  private consultarGraficoGanttUseCase: ConsultarGraficoGanttUseCase;
  @Get('/gannt')
  @ApiOperation({ summary: 'Gera informações para o gráfico' })
  @ApiResponse({
    status: 200,
    description: 'Tabela de produção gerada com sucesso',
    type: () => GetGanttInformationDto,
  })
  async getGanttInformationMethod(
    @Query() dto: ConsultarGanttDTO,
  ): Promise<GetGanttInformationDto> {
    return await this.consultarGraficoGanttUseCase.consultar(dto);
  }
}
