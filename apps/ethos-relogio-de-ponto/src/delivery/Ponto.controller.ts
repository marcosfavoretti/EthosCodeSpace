import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PROCESSA_WORKER } from '../@core/symbols/symbols';
import { SincronizaPontosUseCase } from '@app/modules/modules/relogio-de-ponto/application/SincronizaPontos.usecase';
import { ResPontoRegistroDTO } from '@app/modules/contracts/dto/ResPontoRegistro.dto';
import {  ApiExtraModels, ApiResponse } from '@nestjs/swagger';
import { ConsultaMarcacaoPontosUseCase } from '@app/modules/modules/relogio-de-ponto/application/ConsultaPontos.usecase';
import { ConsultaMarcacaoDTO } from '@app/modules/contracts/dto/ConsultaMarcacao.dto';
import {
  PaginatedResponseDto,
  ResponsePaginatorDTO,
} from '@app/modules/contracts/dto/ResponsePaginator.dto';
import { ResRegistroPontoTurnoPontoDTO } from '@app/modules/contracts/dto/ResRegistroPontoTurno.dto';
import { ResPontoFuncionarioDTO } from '@app/modules/contracts/dto/ResPontoFuncionario.dto';
import { JwtGuard } from '@app/modules/shared/guards/jwt.guard';
import { RolesGuard } from '@app/modules/shared/guards/VerificaCargo.guard';
import { Roles } from '@app/modules/shared/decorators/Cargo.decorator';
import { CargoEnum } from '@app/modules/modules/user/@core/enum/CARGOS.enum';

@Roles(CargoEnum.ADMIN, CargoEnum.LIDER_LASER, CargoEnum.LIDER_MONTAGEM, CargoEnum.LIDER_SOLDA, CargoEnum.LIDER_QUALIDADE, CargoEnum.DIRETOR)
@UseGuards(JwtGuard, RolesGuard)
@Controller()
@ApiExtraModels(
  ResRegistroPontoTurnoPontoDTO,
  ResponsePaginatorDTO,
  ResPontoFuncionarioDTO,
)
export class PontoController {

  @Inject(SincronizaPontosUseCase)
  private sincronizaPontosUseCase: SincronizaPontosUseCase;
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    type: ResPontoRegistroDTO,
    isArray: true,
  })
  @Post('sincroniza')
  async sicnronizaPontoMethod(): Promise<ResPontoRegistroDTO[]> {
    return await this.sincronizaPontosUseCase.sincronizarPontos();
  }

  @Inject(ConsultaMarcacaoPontosUseCase)
  private consultaMarcacaoPonto: ConsultaMarcacaoPontosUseCase;
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    type: PaginatedResponseDto(ResRegistroPontoTurnoPontoDTO),
    isArray: true,
  })
  @Get('registro')
  async consultaMarcacaoMethod(
    @Query() payload: ConsultaMarcacaoDTO,
  ): Promise<ResponsePaginatorDTO<ResRegistroPontoTurnoPontoDTO>> {
    console.log(payload);
    return await this.consultaMarcacaoPonto.consulta(payload);
  }

  // @Inject(ProcessaTipoMarcacaoUseCase)
  // private processaTipoMarcacaoUseCase: ProcessaTipoMarcacaoUseCase;
  // @HttpCode(HttpStatus.OK)
  // @ApiResponse({
  //   type: ResPontoRegistroDTO,
  //   isArray: true,
  // })
  // @ApiBody({
  //   isArray: true,
  //   type: ResPontoRegistroDTO,
  // })
  // @Post('marcacao')
  // async processaTipoMarcacaoMethod(
  //   @Body(new ParseArrayPipe({ items: ResPontoRegistroDTO })) payload: ResPontoRegistroDTO[],
  // ): Promise<ResponsePaginatorDTO<TipoMarcacaoPonto>> {
  //   console.log(payload);
  //   return await this.processaTipoMarcacaoUseCase.processa(payload);
  // }
}
