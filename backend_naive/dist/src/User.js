"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(ws) {
        this.socket = ws;
        this.isPlaying = false;
    }
    markPlaying(status) {
        this.isPlaying = status;
    }
    getSocket() {
        return this.socket;
    }
    send(payload) {
        if (this.socket.readyState === this.socket.OPEN) {
            this.socket.send(JSON.stringify(payload));
        }
    }
}
exports.User = User;
