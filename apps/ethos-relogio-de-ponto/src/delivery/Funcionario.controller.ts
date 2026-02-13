import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConsultaFuncionariosDTO } from '@app/modules/contracts/dto/ConsultaFuncionarios.dto';
import { ConsultaFuncionariosUseCase } from '@app/modules/modules/relogio-de-ponto/application/ConsultaFuncionarios.usecase';
import { ApiResponse } from '@nestjs/swagger';
import {
  PaginatedResponseDto,
  ResponsePaginatorDTO,
} from '@app/modules/contracts/dto/ResponsePaginator.dto';
import { ResPontoFuncionarioDTO } from '@app/modules/contracts/dto/ResPontoFuncionario.dto';
import { ConsultarCentrodeCustoUseCase } from '@app/modules/modules/relogio-de-ponto/application/ConsultarCentroDeCusto.usecase';
import { ResCentroDeCustoDTO } from '@app/modules/contracts/dto/ResCentroDeCusto.dto';
import { Roles } from '@app/modules/shared/decorators/Cargo.decorator';
import { CargoEnum } from '@app/modules/modules/user/@core/enum/CARGOS.enum';
import { JwtGuard } from '@app/modules/shared/guards/jwt.guard';
import { RolesGuard } from '@app/modules/shared/guards/VerificaCargo.guard';

@Roles(CargoEnum.ADMIN, CargoEnum.LIDER_LASER, CargoEnum.LIDER_MONTAGEM, CargoEnum.LIDER_SOLDA, CargoEnum.LIDER_QUALIDADE, CargoEnum.DIRETOR)
@UseGuards(JwtGuard, RolesGuard)
@Controller('/funcionario')
export class FuncionarioController {
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

  //

  @Inject(ConsultarCentrodeCustoUseCase)
  private consutarCentroDeCustoUseCase: ConsultarCentrodeCustoUseCase;
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    type: ResCentroDeCustoDTO,
    isArray: true,
  })
  @Get('centro-custo')
  async consultarCentroDeCustoMethod(): Promise<ResCentroDeCustoDTO[]> {
    return await this.consutarCentroDeCustoUseCase.consultar();
  }
}
