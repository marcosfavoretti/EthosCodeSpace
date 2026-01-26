import { Module } from '@nestjs/common';
import { PedidoServiceModule } from './PedidoService.module';
import { ItemServiceModule } from './ItemService.module';
import { ConsultaItensDoPedidoUseCase } from './application/ConsultaItensDoPedido.usecase';
import { ConsultarPedidosUseCase } from './application/ConsultarPedidos.usecase';
import { ImportaPedidoLogixUseCase } from './application/ImportaPedidosLogix.usecase';
import { BuscarPedidosLogixUseCase } from './application/BuscarPedidoLogix.usecase';
import { INotificaFalhas } from './@core/interfaces/INotificaFalhas';
import { PlanejadorNotificaLoggerService } from './infra/service/PlanejadorNotificaLogger.service';

@Module({
  imports: [
    ItemServiceModule,
    PedidoServiceModule,
  ],
  providers: [

    ConsultaItensDoPedidoUseCase,
    ConsultarPedidosUseCase,
    BuscarPedidosLogixUseCase,
  ],
  exports: [
    ConsultaItensDoPedidoUseCase,
    ConsultarPedidosUseCase,
    BuscarPedidosLogixUseCase,
  ],
})
export class PedidoModule {}
