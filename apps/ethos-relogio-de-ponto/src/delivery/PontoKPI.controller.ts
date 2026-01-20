import { ConsultaMarcacaoDTO } from '@app/modules/contracts/dto/ConsultaMarcacao.dto';
import { ResHorasIrregularesDTO } from '@app/modules/contracts/dto/ResHorasIrregulares.dto';
import { MaisHorasIrregularesKPIUseCase } from '@app/modules/modules/relogio-de-ponto/application/MaisHorasIrregularesKPI.usecase';
import { CargoEnum } from '@app/modules/modules/user/@core/enum/CARGOS.enum';
import { Roles } from '@app/modules/shared/decorators/Cargo.decorator';
import { JwtGuard } from '@app/modules/shared/guards/jwt.guard';
import { RolesGuard } from '@app/modules/shared/guards/VerificaCargo.guard';
import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

@Roles(CargoEnum.ADMIN)
@UseGuards(JwtGuard, RolesGuard)
@Controller('/kpi')
export class PontoKPIController {
  @Inject(MaisHorasIrregularesKPIUseCase)
  private maisHorasIregularesKPIUseCase: MaisHorasIrregularesKPIUseCase;

  @ApiResponse({
    type: ResHorasIrregularesDTO,
    isArray: true,
  })
  @Get('/mais-horas-irregulares')
  async consultarMaisHorasIrregulares(
    @Query() dto: ConsultaMarcacaoDTO,
  ): Promise<ResHorasIrregularesDTO[]> {
    return await this.maisHorasIregularesKPIUseCase.consultar(dto);
  }
}
