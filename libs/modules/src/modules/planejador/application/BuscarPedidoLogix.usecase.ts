import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { startOfMonth } from 'date-fns';
import { PedidoLogixDAO } from '../infra/DAO/PedidoLogix.dao';
import { Pedido } from '../@core/entities/Pedido.entity';
import { PedidoLogixDTO } from '@app/modules/contracts/dto/PedidoLogix.dto';
@Injectable()
export class BuscarPedidosLogixUseCase {
  constructor(@Inject(PedidoLogixDAO) private pedidoLogixDAO: PedidoLogixDAO) {}

  async execute(): Promise<Partial<Pedido>[]> {
    Logger.log('Iniciando job de importação 💨');
    try {
      const pedidosParaProcessar = await this.obterPedidosParaProcessar();
      Logger.log(
        `Encontrados ${pedidosParaProcessar.length} pedidos para processar`,
      );
      return pedidosParaProcessar;
    } catch (error) {
      Logger.error('Erro ao executar o job de importação', error);
      throw new InternalServerErrorException('Falha ao buscar Pedido');
    }
  }

  private async obterPedidosParaProcessar(): Promise<Partial<Pedido>[]> {
    const pedidosEncontrados = await this.pedidoLogixDAO.search(
      startOfMonth(new Date()),
    );
    return pedidosEncontrados.map(PedidoLogixDTO.toDomainEntity);
  }
}
