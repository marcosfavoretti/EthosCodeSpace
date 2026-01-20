import { ConsultartPorPedidoDto } from '@app/modules/contracts/dto/ConsultarPedido.dto';
import { ConsultarPedidosDTO } from '@app/modules/contracts/dto/ConsultarPedidos.dto';
import { ItemResDto } from '@app/modules/contracts/dto/ItemRes.dto';
import { PedidoResponseDTO } from '@app/modules/contracts/dto/PedidoResponse.dto';
import { ConsultaItensDoPedidoUseCase } from '@app/modules/modules/planejador/application/ConsultaItensDoPedido.usecase';
import { ConsultarPedidosUseCase } from '@app/modules/modules/planejador/application/ConsultarPedidos.usecase';
import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

@Controller('pedido')
export class PedidoController {
  @Inject(ConsultarPedidosUseCase)
  private consultarPedidosUseCase: ConsultarPedidosUseCase;
  @ApiResponse({
    type: () => PedidoResponseDTO,
    isArray: true,
  })
  @Get('/')
  async consultaPedidoMethod(
    @Query() dto: ConsultarPedidosDTO,
  ): Promise<PedidoResponseDTO[]> {
    return await this.consultarPedidosUseCase.consultar(dto);
  }

  @Inject(ConsultaItensDoPedidoUseCase)
  private consultaItensDoPedidoUseCase: ConsultaItensDoPedidoUseCase;
  @ApiResponse({
    type: () => ItemResDto,
    isArray: true,
  })
  @Get('/itens')
  async consultaItensDoPedidoMethod(
    @Query() dto: ConsultartPorPedidoDto,
  ): Promise<ItemResDto[]> {
    return await this.consultaItensDoPedidoUseCase.consulta(dto);
  }
}
