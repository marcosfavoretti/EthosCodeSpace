import { Module } from '@nestjs/common';
import { PedidoService } from './infra/service/Pedido.service';
import { PedidoRepository } from './infra/repository/Pedido.repository';
import { PedidoLogixDAO } from './infra/DAO/PedidoLogix.dao';
import { INotificaFalhas } from './@core/interfaces/INotificaFalhas';
import { PlanejadorNotificaLoggerService } from './infra/service/PlanejadorNotificaLogger.service';

@Module({
  imports: [],
  providers: [    //injecao da dependencia responsavel por mandar a causa do problema de importacao do pedido
    PedidoRepository, PedidoLogixDAO, PedidoService],
  exports: [PedidoService, PedidoLogixDAO],
})
export class PedidoServiceModule { }
