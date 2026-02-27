import { Injectable, Logger } from "@nestjs/common";
import { SocketReadyState } from "net";
import { Socket } from "socket.io";

@Injectable()
export class WsUserStoreService {
    private users: Socket[] = [];

    addUser(user: Socket) {
        Logger.debug(`Novo user ${user.id} ${user.handshake.query.name}`)
        const result = this.users
            .some(some_client =>
                some_client.id === user.id);
        //
        if (!result) this.users.push(user);
    }

    removeUser(socket: Socket) {
        this.users = this.users.filter(c => c.id !== socket.id);
    }

    getUsers(): Socket[] {
        return Array.from(new Set(this.users));
    }
}