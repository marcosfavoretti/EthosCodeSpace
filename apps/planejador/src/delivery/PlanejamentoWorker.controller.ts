import { Controller, Inject, Logger } from '@nestjs/common';
import { PlanejarPedidoUseCase } from '@app/modules/modules/planejador/application';
import { PedidoService } from '@app/modules/modules/planejador/infra/service/Pedido.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { PLANEJADOR_PLANEJAR } from '../@core/const/planejador.const';

@Controller()
export class PlanejamentoWorkerController {
    constructor(
        @Inject(PlanejarPedidoUseCase) private planejarPedidoUseCase: PlanejarPedidoUseCase,
        @Inject(PedidoService) private pedidoService: PedidoService
    ) { }


    @EventPattern(PLANEJADOR_PLANEJAR)
    async handle(
        @Payload()
        data: { pedidoId: string },
        @Ctx()
        context: RmqContext,
    ) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();
        try {
            Logger.log('Processando pedido', data.pedidoId);
            
            await this.planejarPedidoUseCase
                .planeje({ pedidoIds: [Number(data.pedidoId)] });
            
            Logger.log('Pedido processado', data.pedidoId);

        } catch (error) {
            console.error('Erro no pedido', data.pedidoId, error);
        }
        finally {
            channel.ack(originalMsg);
            Logger.log('Work end 👷👌');
        }
    }
}
