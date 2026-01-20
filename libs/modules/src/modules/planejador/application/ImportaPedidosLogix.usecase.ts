import { Inject, Injectable, Logger } from "@nestjs/common";
import { BuscarPedidosLogixUseCase } from "./BuscarPedidoLogix.usecase";
import { PedidoService } from "../infra/service/Pedido.service";
import { Pedido } from "../@core/entities/Pedido.entity";
import { ItemService } from "../infra/service/Item.service";
import type { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { EmailHtml } from "../../notificacao/@core/classes/EmailHtml";
import { differenceInHours, format } from "date-fns";
import { queues } from "../@core/const/queue";
import { EmailHttpClient } from "@app/modules/contracts/clients/EmailHttp.client";
import { INotificaFalhas } from "../@core/interfaces/INotificaFalhas";

@Injectable()
export class ImportaPedidoLogixUseCase {
    private lastEmailSentAt: Date | null = null;
    private falhaNoSalvar: Partial<Pedido>[] = [];
    private falhaNoPlanejar: Pedido[] = [];

    constructor(
        @InjectQueue(queues.planejamento) private planejamentoQueue: Queue,
        @Inject(INotificaFalhas) private emailSenderService: INotificaFalhas,
        @Inject(ItemService) private itemService: ItemService,
        @Inject(BuscarPedidosLogixUseCase) private buscarPedidosLogixUseCase: BuscarPedidosLogixUseCase,
        @Inject(PedidoService) private pedidoService: PedidoService,
    ) { }

    async execute(): Promise<void> {
        try {
            const pedidosParaProcessar = await this.buscarPedidosLogixUseCase.execute();
            //salvar pedidos
            const pedidosSalvos = await this.salvarPedidos(
                pedidosParaProcessar,
                this.falhaNoSalvar,
            );
            //tentar planejar
            Logger.log(pedidosSalvos.length, ImportaPedidoLogixUseCase.name)
            // await this.executarPlanejamento(pedidosSalvos, this.falhaNoPlanejar);
        }
        catch (error) {
            Logger.error(
                'Erro inesperado no processo de importação',
                error.stack,
            );
        } finally {
            //enviar erros cada 12 horas
            await this.enviarResumoDeFalhas(this.falhaNoSalvar, this.falhaNoPlanejar);
        }
    }

    private async salvarPedidos(
        pedidos: Partial<Pedido>[],
        falhaNoSalvar: Partial<Pedido>[],
    ): Promise<Pedido[]> {
        const pedidosSalvos: Pedido[] = [];
        for (const pedido of pedidos) {
            if (
                this.falhaNoPlanejar.map((a) => a.hash).includes(pedido.hash!) ||
                this.falhaNoSalvar.map((a) => a.hash).includes(pedido.hash)
            ) {
                continue;
            }
            try {
                await this.itemService.consultarItem(pedido.item!.Item); //se nao achar o item ele nao vai salvar
                const result = await this.pedidoService.savePedido([pedido]);
                pedidosSalvos.push(...result);
            } catch (error) {
                falhaNoSalvar.push(pedido);
                Logger.warn(`Falha ao salvar pedido: ${pedido.id}\n ${error}`);
            }
        }
        return pedidosSalvos;
    }

    private async testarConexaoRedis(): Promise<void> {
        const client = await this.planejamentoQueue.client;
        await client.ping();
        Logger.log('Conexão com Redis confirmada ✅');
    }

    private async executarPlanejamento(
        pedidos: Pedido[],
        falhaNoPlanejar: Pedido[],
    ): Promise<void> {
        if (!pedidos.length) return;
        Logger.log('Iniciando etapa de planejamento 🫷');
        try {
            await this.testarConexaoRedis();
        } catch (err) {
            Logger.error('Redis indisponível, não será possível planejar', err);
            falhaNoPlanejar.push(...pedidos);
            return;
        }

        const pedidosComDependencias = await this.pedidoService.consultarPedidos(
            pedidos.map((ped) => ped.id),
        );

        const pedidosValidos = pedidosComDependencias.filter((ped) =>
            ped.pedidoEhValido(),
        );

        if (!pedidosValidos.length) {
            Logger.log('Nenhum pedido válido encontrado para planejamento');
            return;
        }

        const pedidosValidosPrioridade = pedidosValidos.sort(
            (a, b) => a.getSafeDate().getTime() - b.getSafeDate().getTime(),
        );

        for (const pedido of pedidosValidosPrioridade) {
            try {
                const job = await this.planejamentoQueue.add(
                    'planejar',
                    { pedidoId: pedido.id },
                    {
                        removeOnComplete: true,
                        attempts: 3,
                        backoff: 5000,
                        timeout: 60000,
                    },
                );
                Logger.log(`Pedido ${pedido.id} adicionado à fila - ${job}`);
            } catch (err) {
                Logger.error(`Falha ao enfileirar pedido ${pedido.id}`, err);
                falhaNoPlanejar.push(pedido);
            }
        }
    }

    private async enviarResumoDeFalhas(
        falhaNoSalvar: Partial<Pedido>[],
        falhaNoPlanejar: Pedido[],
    ): Promise<void> {
        if (!falhaNoSalvar.length && !falhaNoPlanejar.length) return;

        if (
            this.lastEmailSentAt &&
            differenceInHours(new Date(), this.lastEmailSentAt) < 12
        ) {
            Logger.log(
                'O e-mail de resumo de falhas foi enviado há menos de 12 horas. O envio foi ignorado.',
            );
            return;
        }

        await this.emailSenderService.notificarFalha(
            {
                message: `
                <h1>Falhas no job de importação:</h1>
                <br><br>
                <h2>Falha no planejamento</h2>
                <ul>
                    ${falhaNoPlanejar.map((p) => `<li>pedidoId:${p.id} data:${format(p.getSafeDate(), 'dd/MM/yyyy')} item:${p.item.Item} desc:${p.item.Item}</li>`).join('\n')}
                </ul>
                <h2>Falha ao importar</h2>
                <ul>
                    ${falhaNoSalvar.map((p: Pedido) => `<li>${p.item.Item}</li>`).join('\n')}
                </ul>
            `,
                subject: 'Erro ao processar pedidos',
                to: ['marcos.junior@ethos.ind.br'],
            }
        );
        this.lastEmailSentAt = new Date();
    }
}