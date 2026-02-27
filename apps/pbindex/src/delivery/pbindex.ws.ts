import { Inject, Logger } from "@nestjs/common";
import { SubscribeMessage, OnGatewayConnection, WebSocketGateway, WebSocketServer, OnGatewayDisconnect, OnGatewayInit, MessageBody, ConnectedSocket } from "@nestjs/websockets";
import { format } from "date-fns";
import { Server, Socket } from 'socket.io';
import { PowerbiDatasetRefreshUseCase } from "@app/modules/modules/powerbi/application";
import { WsUserStoreService } from "../@core/service/WsUserStore.service";
import { WsEvent } from "../@core/enum/ws.events";
import { ConfigService } from "@nestjs/config";
import { IPowerbiRefreshObserver } from "@app/modules/modules/powerbi/@core/interfaces/IPowerbiRefreshObserver";
import { ICheckRaceCondicion } from "@app/modules/modules/powerbi/@core/interfaces/ICheckRaceCondicion";
import { PowerbiStateStoreService } from "@app/modules/modules/powerbi/@core/service/PowerbiStateStore.service";
import { PowerbiState } from "@app/modules/modules/powerbi/class/PowerbiState";
@WebSocketGateway(30001, {
    cors: {
        origin: '*'
    },
    transports: ['websocket'], // Adiciona suporte a ambos os transportes
})
export class PowerBIWebSocket implements
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    IPowerbiRefreshObserver,
    ICheckRaceCondicion {

    @WebSocketServer()
    server: Server;

    constructor(
        private configService: ConfigService,
        private wsStateStoreService: PowerbiStateStoreService,
        private wsUserStoreService: WsUserStoreService,
        private powerbiAttservice: PowerbiDatasetRefreshUseCase
    ) { }

    validRun(): boolean {
        return this.wsStateStoreService.getState().getUsing() === false;
    }

    handleConnection(client: Socket) {
        this.wsUserStoreService.addUser(client);
        client.emit(WsEvent.POWERBIFEEDBACK,
            this.wsStateStoreService
                .getState()
                .asDto()
        );
    }

    @SubscribeMessage(WsEvent.POWERBIONLINEUSER)
    async handleEventOnlineUser(): Promise<any> {
        return this.wsUserStoreService.getUsers();
    }

    @SubscribeMessage(WsEvent.POWERBIREFRESH)
    async handleEvent(
        @MessageBody() data: { datasetID: number, admin: boolean },
        @ConnectedSocket() client: Socket,
    ): Promise<any> {
        const author = client.handshake.query.name as string;
        
        try {
            const refreshedDataset = await this.powerbiAttservice
                .execute({
                    ...data,
                    authorName: author,
                    observer: this
                });

            const wsStateRefreshDone = new PowerbiState({
                describe: `existem atualizações para o relatório ${refreshedDataset.name}, deseja atualizar a pagina para carregar essas mudanças?`,
                using: false,
            });
            const wsPosRefreshDone = new PowerbiState({
                describe: `${refreshedDataset.name} atualizado com sucessos em ${format(new Date(), 'dd/MM/yyyy HH:mm')}`,
                using: false,
                authorName: author
            })

            this.wsStateStoreService.setState(wsStateRefreshDone);
            this.sendState({
                event: WsEvent.POWERBIREFRESHDONE,
                state: wsStateRefreshDone,
                users: this.wsUserStoreService.getUsers()
            });

            this.wsStateStoreService.setState(wsPosRefreshDone);
            this.sendState({
                event: WsEvent.POWERBIFEEDBACK,
                state: wsPosRefreshDone,
                users: this.wsUserStoreService.getUsers()
            });
        }
        catch (err) {
            Logger.error('---------------------------------')
            Logger.error(err);
            Logger.error('---------------------------------')
            const messageFailOver = err?.message || 'Erro desconhecido';
            const wsErrorState = new PowerbiState({
                describe: messageFailOver,
                using: false,
            });
            this.wsStateStoreService.setState(wsErrorState);
            this.sendState({
                event: WsEvent.POWERBIFEEDBACK,
                state: wsErrorState,
                users: this.wsUserStoreService.getUsers()
            });
        }
    }
    //
    afterInit(server: any) {
        const wsPort = this.configService.get<string>('WSPORT');
        const wsHost = this.configService.get<string>('WSHOST');
        Logger.debug('WebSocket running on port -> '
            + wsHost + ':' + wsPort);
    }

    //metodo o IPowerbiObserver
    emit(message: string): void | Promise<void> {
        //copia o ultimo estado so muda a msg
        const wsStateUpdate = new PowerbiState({
            ...this.wsStateStoreService.getState().asDto(),
            describe: message
        });
        this.wsStateStoreService.setState(wsStateUpdate);
        this.sendState({
            event: WsEvent.POWERBIFEEDBACK,
            state: wsStateUpdate,
            users: this.wsUserStoreService.getUsers()
        });
    }

    // Método que é chamado automaticamente ao desconectar um cliente
    handleDisconnect(client: Socket) {
        this.wsUserStoreService.removeUser(client);
        Logger.error('Client disconnected:', client.id);
    }

    //
    private sendState(
        props: {
            users: Socket[],
            event: WsEvent,
            state: PowerbiState
        }): void {
        for (const client of props.users) {
            client.emit(props.event, props.state.asDto());
        }
    }

}
