import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  ParseArrayPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PROCESSA_WORKER } from '../@core/symbols/symbols';
import { SincronizaPontosUseCase } from '@app/modules/modules/relogio-de-ponto/application/SincronizaPontos.usecase';
import { ResPontoRegistroDTO } from '@app/modules/contracts/dto/ResPontoRegistro.dto';
import { ApiBody, ApiExtraModels, ApiResponse } from '@nestjs/swagger';
import { ConsultaMarcacaoPontosUseCase } from '@app/modules/modules/relogio-de-ponto/application/ConsultaPontos.usecase';
import { ConsultaMarcacaoDTO } from '@app/modules/contracts/dto/ConsultaMarcacao.dto';
import { PaginatedResponseDto, ResponsePaginatorDTO } from '@app/modules/contracts/dto/ResponsePaginator.dto';
import { TipoMarcacaoPonto } from '@app/modules/modules/relogio-de-ponto/@core/entities/TipoMarcacaoPonto.entity';
import { ProcessaTipoMarcacaoUseCase } from '@app/modules/modules/relogio-de-ponto/application/ProcessaTipoMarcacao.usecase';
import { ResRegistroPontoTurnoPontoDTO } from '@app/modules/contracts/dto/ResRegistroPontoTurno.dto';
import { ConsultaFuncionariosDTO } from '@app/modules/contracts/dto/ConsultaFuncionarios.dto';
import { ConsultaFuncionariosUseCase } from '@app/modules/modules/relogio-de-ponto/application/ConsultaFuncionarios.usecase';
import { ResPontoFuncionarioDTO } from '@app/modules/contracts/dto/ResPontoFuncionario.dto';

@Controller('/ponto')
@ApiExtraModels(ResRegistroPontoTurnoPontoDTO, ResponsePaginatorDTO, ResPontoFuncionarioDTO)
export class PontoController {
  constructor(@Inject(PROCESSA_WORKER) private client: ClientProxy) { }

  @Get('send')
  send() {
    return this.client.send({ cmd: 'greeting' }, 'Hello from master');
  }

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
    type: PaginatedResponseDto(ResRegistroPontoTurnoPontoDTO), isArray: true,
  })
  @Get('registro')
  async consultaMarcacaoMethod(
    @Query() payload: ConsultaMarcacaoDTO,
  ): Promise<ResponsePaginatorDTO<ResRegistroPontoTurnoPontoDTO>> {
    console.log(payload);
    return await this.consultaMarcacaoPonto.consulta(payload);
  }

  @Inject(ConsultaFuncionariosUseCase)
  private consultaFuncionariosUseCase: ConsultaFuncionariosUseCase;
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    type: PaginatedResponseDto(ResPontoFuncionarioDTO),
  })
  @Get('funcionarios')
  async ConsultaFuncionariosMethod(
    @Query() payload: ConsultaFuncionariosDTO,
  ): Promise<ResponsePaginatorDTO<ResPontoFuncionarioDTO>> {
    return await this.consultaFuncionariosUseCase.consulta(payload);
  }

  @Inject(ProcessaTipoMarcacaoUseCase)
  private processaTipoMarcacaoUseCase: ProcessaTipoMarcacaoUseCase;
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    type: ResPontoRegistroDTO,
    isArray: true,
  })
  @ApiBody({
    isArray: true,
    type: ResPontoRegistroDTO,
  })
  @Post('marcacao')
  async processaTipoMarcacaoMethod(
    @Body(new ParseArrayPipe({ items: ResPontoRegistroDTO })) payload: ResPontoRegistroDTO[],
  ): Promise<ResponsePaginatorDTO<TipoMarcacaoPonto>> {
    console.log(payload);
    return await this.processaTipoMarcacaoUseCase.processa(payload);
  }
}
