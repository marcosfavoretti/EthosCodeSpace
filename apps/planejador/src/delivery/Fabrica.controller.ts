import { AdicionarPlanejamentoDTO } from '@app/modules/contracts/dto/AdicionarPlanejamento.dto';
import { AtualizarPlanejamentoDTO } from '@app/modules/contracts/dto/AtualizarPlanejamento.dto';
import { ConsultaPlanejamentosDTO } from '@app/modules/contracts/dto/ConsultaPlanejamentos.dto';
import { ConsutlarFabricaDTO } from '@app/modules/contracts/dto/ConsultarFabrica.dto';
import { DesplanejarPedidoDto } from '@app/modules/contracts/dto/DesplanejarPedido.dto';
import { FabricaForkDTO } from '@app/modules/contracts/dto/FabricaFork.dto';
import { FabricaResponseDto } from '@app/modules/contracts/dto/FabricaResponse.dto';
import { InputPedidosDTO } from '@app/modules/contracts/dto/InputPedidos.dto';
import { MergeFabricaDto } from '@app/modules/contracts/dto/MergeFabrica.dto';
import { MergeRequestPendingDto } from '@app/modules/contracts/dto/MergeRequestRes.dto';
import { MudancasResDto } from '@app/modules/contracts/dto/MudancaRes.dto';
import { PedidosPlanejadosResponseDTO } from '@app/modules/contracts/dto/PedidosPlanejadosResponse.dto';
import { PlanejamentoResponseDTO } from '@app/modules/contracts/dto/PlanejamentoResponse.dto';
import { RemoverPlanejamentoDTO } from '@app/modules/contracts/dto/RemoverPlanejamento.dto';
import { ReplanejarPedidoDTO } from '@app/modules/contracts/dto/ReplanejarPedido.dto';
import { ResetaFabricaDTO } from '@app/modules/contracts/dto/ResetaFabrica.dto';
import { SincronizarFabricaPrivadaDTO } from '@app/modules/contracts/dto/SincronizarFabricaPrivada.dto';
import { UserFabricaResponseDto } from '@app/modules/contracts/dto/UserFabricaResponse.dto';
import { Fabrica } from '@app/modules/modules/planejador/@core/entities/Fabrica.entity';
import { DonoDaFabricaGuard } from '@app/modules/modules/planejador/@core/guard/dono-da-fabrica.guard';
import { NaPrincipalNao } from '@app/modules/modules/planejador/@core/guard/na-princiapal-nao.guard';
import {
  AdicionarPlanejamentoManualUseCase,
  AtualizarPlanejamentoUseCase,
  ConsultaMergeRequestUseCase,
  ConsultarFabricaUseCase,
  ConsultarHistoricoFabricaUseCase,
  ConsultarPedidosPlanejadosUseCase,
  ConsultarPlanejamentosUseCase,
  ConsutlarFabricaPrincipalAtualUseCase,
  ConsutlarFabricasDoUsuarioUseCase,
  DeletarFabricaUseCase,
  DesplanejarPedidoUseCase,
  MergeFabricaUseCase,
  PlanejarPedidoUseCase,
  RemoverPlanejamentoUseCase,
  ReplanejarPedidoUseCase,
  RequestFabricaForkUseCase,
  RequestFabricaMergeUseCase,
  ResetaFabricaUseCase,
  SincronizarFabricaPrivadaUseCase,
} from '@app/modules/modules/planejador/application';
import { CargoEnum } from '@app/modules/modules/user/@core/enum/CARGOS.enum';
import { Roles } from '@app/modules/shared/decorators/Cargo.decorator';
import { JwtGuard } from '@app/modules/shared/guards/jwt.guard';
import { RolesGuard } from '@app/modules/shared/guards/VerificaCargo.guard';
import type { CustomRequest } from '@app/modules/shared/types/AppRequest.type';
import {
  Body,
  Controller,
  Put,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Query,
  Req,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@UseGuards(JwtGuard)
@ApiTags('Fabrica')
@Controller('fabrica')
export class FabricaController {
  @Inject(ConsutlarFabricaPrincipalAtualUseCase)
  consutlarFabricaPrincipalAtualUseCase: ConsutlarFabricaPrincipalAtualUseCase;
  @Get('/principal')
  @ApiResponse({
    type: () => FabricaResponseDto,
  })
  async consultaFabricaPrincipalMethod(): Promise<FabricaResponseDto> {
    return await this.consutlarFabricaPrincipalAtualUseCase.consultar();
  }

  @Inject(PlanejarPedidoUseCase)
  private planejamentoUseCase: PlanejarPedidoUseCase;
  @HttpCode(HttpStatus.OK)
  @Post('/planejamentos')
  async planejarPedidoMethod(@Body() dto: InputPedidosDTO): Promise<void> {
    return this.planejamentoUseCase.planeje(dto);
  }

  @Inject(ResetaFabricaUseCase)
  private resetaFabricaUseCase: ResetaFabricaUseCase;
  @HttpCode(HttpStatus.OK)
  @UseGuards(DonoDaFabricaGuard)
  @ApiResponse({
    type: () => FabricaResponseDto,
  })
  @Post('/reset')
  async resetaFabricaMethod(
    @Body() dto: ResetaFabricaDTO,
    @Req() req: CustomRequest,
  ): Promise<FabricaResponseDto> {
    return await this.resetaFabricaUseCase.reseta(
      {
        fabricaId: dto.fabricaId,
      },
      req.user.id,
    );
  }

  @Inject(AtualizarPlanejamentoUseCase)
  private atualizarPlanejamentoUseCase: AtualizarPlanejamentoUseCase;
  @HttpCode(HttpStatus.OK)
  @UseGuards(DonoDaFabricaGuard)
  @Put('/planejamentos')
  async atualizarPlanejamentoMethod(
    @Body() payload: AtualizarPlanejamentoDTO,
  ): Promise<void> {
    await this.atualizarPlanejamentoUseCase.atualizar(payload);
  }

  @Inject(RemoverPlanejamentoUseCase)
  private removerPlanejamentoUseCase: RemoverPlanejamentoUseCase;
  @UseGuards(DonoDaFabricaGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('/planejamentos')
  async removerPlanejamentoMethod(
    @Body() payload: RemoverPlanejamentoDTO,
    @Req() req: CustomRequest,
  ): Promise<void> {
    await this.removerPlanejamentoUseCase.remover(payload);
  }

  @Inject(AdicionarPlanejamentoManualUseCase)
  private adicionarPlanejamentoManualUseCase: AdicionarPlanejamentoManualUseCase;
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    type: PlanejamentoResponseDTO,
  })
  @UseGuards(DonoDaFabricaGuard)
  @Post('/planejamentos/manual')
  async planejarManualMethod(
    @Body() dto: AdicionarPlanejamentoDTO,
    @Req() req: CustomRequest,
  ): Promise<PlanejamentoResponseDTO> {
    return this.adicionarPlanejamentoManualUseCase.adicionar(dto);
  }

  @Inject(RequestFabricaForkUseCase)
  private requestFabricaForkUseCase: RequestFabricaForkUseCase;
  @Post('/fork')
  async forkFabricaMethod(@Body() payload: FabricaForkDTO): Promise<Fabrica> {
    return await this.requestFabricaForkUseCase.fork(payload);
  }

  @Inject(ConsutlarFabricasDoUsuarioUseCase)
  private consutlarFabricasDoUsuarioUseCase: ConsutlarFabricasDoUsuarioUseCase;
  @Get('/usuario')
  @ApiResponse({
    type: () => UserFabricaResponseDto,
    isArray: true,
  })
  async consutlarFabricasDoUsuarioUseCaseMethod(
    @Req() req: CustomRequest,
  ): Promise<UserFabricaResponseDto[]> {
    return await this.consutlarFabricasDoUsuarioUseCase.consultar({
      userId: req.user.id,
    });
  }

  @Inject(ConsultarPlanejamentosUseCase)
  private consultarPlanejamentosUseCase: ConsultarPlanejamentosUseCase;
  @ApiResponse({
    type: () => PlanejamentoResponseDTO,
    isArray: true,
  })
  @Get('/planejamentos')
  async consultaPlanejamentosMethod(
    @Query() payload: ConsultaPlanejamentosDTO,
  ): Promise<PlanejamentoResponseDTO[]> {
    return await this.consultarPlanejamentosUseCase.consultar(payload);
  }

  @Inject(ConsultarFabricaUseCase)
  private consultarFabricaUseCase: ConsultarFabricaUseCase;
  @ApiResponse({
    type: () => FabricaResponseDto,
  })
  @Get('/')
  async consultaFabricaMethod(
    @Query() payload: ConsutlarFabricaDTO,
  ): Promise<FabricaResponseDto> {
    return await this.consultarFabricaUseCase.consultar(payload);
  }

  @Inject(ConsultarPedidosPlanejadosUseCase)
  private consultarPedidosPlanejadosUseCase: ConsultarPedidosPlanejadosUseCase;
  @ApiResponse({
    type: PedidosPlanejadosResponseDTO,
    isArray: true,
  })
  @Get('/planejamentos/pedidos')
  async consultarPedidosPlanejadosMethod(
    @Query() payload: ConsutlarFabricaDTO,
  ): Promise<PedidosPlanejadosResponseDTO[]> {
    return await this.consultarPedidosPlanejadosUseCase.consultar(payload);
  }

  @Inject(MergeFabricaUseCase) private mergeFabricaUseCase: MergeFabricaUseCase;
  @ApiResponse({
    type: FabricaResponseDto,
  })
  @Post('/merge')
  @Roles(CargoEnum.ADMIN, CargoEnum.PCP)
  @UseGuards(RolesGuard)
  async mergeFabricaMethod(
    @Body() payload: MergeFabricaDto,
    @Req() req: CustomRequest,
  ): Promise<FabricaResponseDto> {
    return await this.mergeFabricaUseCase.merge({
      dto: payload,
      user: req.user,
    });
  }

  @Inject(RequestFabricaMergeUseCase)
  private requestFabricaMergeUseCase: RequestFabricaMergeUseCase;
  @ApiResponse({
    type: FabricaResponseDto,
  })
  @UseGuards(DonoDaFabricaGuard, NaPrincipalNao)
  @Post('/merge/request')
  async requestFabricaMergeMethod(
    @Body() payload: ConsutlarFabricaDTO,
    @Req() req: CustomRequest,
  ): Promise<void> {
    return await this.requestFabricaMergeUseCase.request({
      dto: payload,
      user: req.user,
    });
  }

  @Inject(ConsultaMergeRequestUseCase)
  private consultaMergeRequestUseCase: ConsultaMergeRequestUseCase;
  @ApiResponse({
    type: () => MergeRequestPendingDto,
    isArray: true,
  })
  @Roles(CargoEnum.ADMIN, CargoEnum.PCP)
  @UseGuards(RolesGuard)
  @Get('/merge/request')
  async getRequestsFabricaMergeMethod(): Promise<MergeRequestPendingDto[]> {
    return await this.consultaMergeRequestUseCase.consultar();
  }

  @Inject(ReplanejarPedidoUseCase)
  private replanejarPedidoUseCase: ReplanejarPedidoUseCase;
  @UseGuards(NaPrincipalNao)
  @Post('/fabrica/replanejamento')
  async ReplanejarPedidoUseCase(
    @Body() payload: ReplanejarPedidoDTO,
  ): Promise<void> {
    return await this.replanejarPedidoUseCase.replanejar(payload);
  }

  @Inject(DesplanejarPedidoUseCase)
  private desplanejarPedidoUseCase: DesplanejarPedidoUseCase;
  @Roles(CargoEnum.ADMIN, CargoEnum.PCP)
  @UseGuards(RolesGuard)
  @Delete('/fabrica/pedido')
  async desplanejarPedidoNaFabricaMethod(
    @Body() payload: DesplanejarPedidoDto,
    @Req() request: CustomRequest,
  ): Promise<void> {
    return await this.desplanejarPedidoUseCase.desplanejar(
      payload,
      request.user,
    );
  }

  @Inject(DeletarFabricaUseCase)
  private deletarFabricaUseCase: DeletarFabricaUseCase;
  @UseGuards(DonoDaFabricaGuard, NaPrincipalNao)
  @Delete('/fabrica')
  async deletarFabricaMethod(
    @Body() payload: ConsutlarFabricaDTO,
    @Req() req: CustomRequest,
  ): Promise<void> {
    return await this.deletarFabricaUseCase.deleta(payload, req.user);
  }

  @Inject(ConsultarHistoricoFabricaUseCase)
  private consultarHistoricoFabricaUseCase: ConsultarHistoricoFabricaUseCase;
  @ApiResponse({
    type: () => MudancasResDto,
    isArray: true,
  })
  @ApiOperation({ summary: 'busca mudancas que foram aplicadas nessa fabrica' })
  @Get('/historico')
  async consultaHistoricoFabricaMethod(
    @Query() payload: ConsutlarFabricaDTO,
    @Req() req: CustomRequest,
  ): Promise<MudancasResDto[]> {
    return await this.consultarHistoricoFabricaUseCase.executaComparacao(
      payload,
    );
  }

  @Inject(SincronizarFabricaPrivadaUseCase)
  private sincronizarFabricaPrivadaUseCase: SincronizarFabricaPrivadaUseCase;
  @UseGuards(NaPrincipalNao, DonoDaFabricaGuard)
  @ApiResponse({
    type: () => SincronizarFabricaPrivadaDTO,
  })
  @ApiOperation({
    summary: 'sicronizar com o nó principal atual',
    description:
      'operação que força uma fabrica a mudar o pai dela para o nó principal mais recente',
  })
  @Post('/sincronizar')
  async sincronizarFabricaPrivadaMethod(
    @Body() payload: SincronizarFabricaPrivadaDTO,
    @Req() req: CustomRequest,
  ): Promise<SincronizarFabricaPrivadaDTO> {
    return await this.sincronizarFabricaPrivadaUseCase.sincroniza(payload);
  }
}
