import { Module } from '@nestjs/common';
import { PedidoServiceModule } from './PedidoService.module';
import { ItemServiceModule } from './ItemService.module';
import { ConsultaItensDoPedidoUseCase } from './application/ConsultaItensDoPedido.usecase';
import { ConsultarPedidosUseCase } from './application/ConsultarPedidos.usecase';
import { ImportaPedidoLogixUseCase } from './application/ImportaPedidosLogix.usecase';
import { BuscarPedidosLogixUseCase } from './application/BuscarPedidoLogix.usecase';
import { BullModule } from '@nestjs/bull';
import { queues } from './@core/const/queue';
import { EmailHttpClient } from '@app/modules/contracts/clients/EmailHttp.client';
import { INotificaFalhas } from './@core/interfaces/INotificaFalhas';
import { PlanejadorNotificaPorEmailService } from './infra/service/PlanejadorNotificaPorEmail.service';
import { PlanejadorNotificaLoggerService } from './infra/service/PlanejadorNotificaLogger.service';

@Module({
  imports: [
    ItemServiceModule,
    PedidoServiceModule,
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST, // nome do serviço do docker-compose
        port: +process.env.REDIS_PORT!,
      },
    }),
    BullModule.registerQueue({
      name: queues.planejamento,
    }),
  ],
  providers: [
    EmailHttpClient,
    //injecao da dependencia responsavel por mandar a causa do problema de importacao do pedido 
    {
      provide: INotificaFalhas,
      useClass: PlanejadorNotificaLoggerService
    },
    ConsultaItensDoPedidoUseCase,
    ConsultarPedidosUseCase,
    ImportaPedidoLogixUseCase,
    BuscarPedidosLogixUseCase
  ],
  exports: [ConsultaItensDoPedidoUseCase, ConsultarPedidosUseCase, ImportaPedidoLogixUseCase, BuscarPedidosLogixUseCase],
})
export class PedidoModule { }
