import { Module } from '@nestjs/common';
import { PedidoService } from './infra/service/Pedido.service';
import { PedidoRepository } from './infra/repository/Pedido.repository';
import { PedidoLogixDAO } from './infra/DAO/PedidoLogix.dao';

@Module({
  imports: [],
  providers: [PedidoRepository, PedidoLogixDAO, PedidoService],
  exports: [PedidoService, PedidoLogixDAO],
})
export class PedidoServiceModule {}
