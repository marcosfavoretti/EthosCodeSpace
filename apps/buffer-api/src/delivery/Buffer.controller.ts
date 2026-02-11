import { SaveBufferLogDto } from '@app/modules/contracts/dto/SaveBufferLog.dto';
import { ResBufferHistoricoDto } from '@app/modules/contracts/dto/ResBufferHistorico.dto';
import { CompactBuffer } from '@app/modules/modules/buffer/@core/class/CompactBuffer';
import { ConsultarBufferCompactadoUseCase } from '@app/modules/modules/buffer/application/ConsultarBufferCompactado.usecase';
import { JobCriacaoTabelaUseCase } from '@app/modules/modules/buffer/application/JobCriacaoTabela.usecase';
import { SaveBufferInHistUseCase } from '@app/modules/modules/buffer/application/SaveBufferInHist.usecase';
import { Body, Controller, Get, Inject, Post, Query, UseGuards } from '@nestjs/common';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { endOfDay, parse } from 'date-fns';
import { JwtGuard } from '@app/modules/shared/guards/jwt.guard';
import { RolesGuard } from '@app/modules/shared/guards/VerificaCargo.guard';
import { Roles } from '@app/modules/shared/decorators/Cargo.decorator';
import { CargoEnum } from '@app/modules/modules/user/@core/enum/CARGOS.enum';
@Roles(CargoEnum.PCP, CargoEnum.ADMIN)
@UseGuards(JwtGuard, RolesGuard)
@Controller('/')
export class BufferController {
  @Inject(SaveBufferInHistUseCase)
  private bufferHistUseCase: SaveBufferInHistUseCase;
  @ApiResponse({
    status: 201,
    type: ResBufferHistoricoDto,
  })
  @Post('/')
  async saveBufferLog(
    @Body() dto: SaveBufferLogDto,
  ): Promise<ResBufferHistoricoDto> {
    return await this.bufferHistUseCase.saveHistorico(dto);
  }

  @Inject(ConsultarBufferCompactadoUseCase)
  private consultarBufferCompactadoUseCase: ConsultarBufferCompactadoUseCase;
  @ApiQuery({
    example: '12-06-2025',
    name: 'startDate',
    required: true,
    type: String,
    description: 'Data inicial (obrigatória)',
  })
  @ApiQuery({
    example: '12-06-2025',
    name: 'endDate',
    required: false,
    type: String,
    description: 'Data final (opcional)',
  })
  @ApiResponse({
    status: 200,
    type: () => CompactBuffer,
    isArray: true,
  })
  @Get()
  async consultBufferMethod(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    if (!startDate) {
      throw new Error('startDate query parameter is required');
    }
    const start = parse(startDate, 'dd-MM-yyyy', new Date());
    const end = endDate
      ? endOfDay(parse(endDate, 'dd-MM-yyyy', new Date()))
      : endOfDay(new Date());
    return await this.consultarBufferCompactadoUseCase.consultar({
      startDate: start,
      endDate: end,
    });
  }

  @Inject(JobCriacaoTabelaUseCase)
  private jobCriacaoTabelaUseCase: JobCriacaoTabelaUseCase;
  @ApiResponse({
    status: 201,
    description: 'Job de criação de tabela executado com sucesso',
  })
  @Post('/dev')
  async jobMethod() {
    await this.jobCriacaoTabelaUseCase.job();
  }
}
