import { Inject, InternalServerErrorException, Logger } from '@nestjs/common';
import { PedidoService } from '../infra/service/Pedido.service';
import {
  ConsultarPedidosDTO,
  TIPO_CONSULTA,
} from '@app/modules/contracts/dto/ConsultarPedidos.dto';
import { PedidoResponseDTO } from '@app/modules/contracts/dto/PedidoResponse.dto';

export class ConsultarPedidosUseCase {
  constructor(@Inject(PedidoService) private pedidoService: PedidoService) { }

  private readonly paramMatrix: Record<TIPO_CONSULTA, boolean | 'TODOS'> = {
    n_planejados: false,
    planejados: true,
    todos: 'TODOS',
  };

  async consultar(dto: ConsultarPedidosDTO): Promise<PedidoResponseDTO[]> {
    try {
      const result =
        this.paramMatrix[dto.tipoConsulta] === 'TODOS'
          ? await this.pedidoService.consultarPedidosNoPeriodo()
          : await this.pedidoService.consultaPedidosPlanejadosOuNPlanejados(
            Boolean(this.paramMatrix[dto.tipoConsulta]),
          );
      return result
        .sort((a, b) => a.dataEntrega.getTime() - b.dataEntrega.getTime())
        .map((res) => PedidoResponseDTO.fromEntity(res));
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException('Falha ao consultar os pedidos');
    }
  }
}
