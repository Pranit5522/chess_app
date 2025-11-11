import { WebSocket } from "ws"

export class User {
    private socket: WebSocket;
    isPlaying: boolean;

    constructor(ws: WebSocket) {
        this.socket = ws;
        this.isPlaying = false;
    }

    markPlaying(status: boolean) {
        this.isPlaying = status;
    }

    getSocket() {
        return this.socket;
    }

    send(payload: object) {
        if(this.socket.readyState === this.socket.OPEN) {
            this.socket.send(JSON.stringify(payload))
        }
    }
}