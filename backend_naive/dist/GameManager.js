"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const messages_1 = require("./messages");
const Game_1 = require("./Game");
const User_1 = require("./User");
class GameManager {
    constructor() {
        this.games = [];
        this.users = [];
        this.pendingUser = null;
    }
    addUser(ws) {
        const user = new User_1.User(ws);
        this.users.push(user);
        this.addHandler(user);
    }
    removeUser(ws) {
        this.users = this.users.filter(user => user.getSocket() !== ws);
    }
    addHandler(user) {
        const ws = user.getSocket();
        ws.on("message", (data) => {
            const message = JSON.parse(data.toString());
            if (message.type === messages_1.INIT_GAME) {
                if (user.isPlaying) {
                    return;
                }
                user.markPlaying(true);
                if (this.pendingUser) {
                    const game = new Game_1.Game(this.pendingUser, user);
                    this.games.push(game);
                    this.pendingUser = null;
                }
                else {
                    this.pendingUser = user;
                }
            }
            if (message.type === messages_1.MOVE) {
                const game = this.games.find(game => game.player1 === user || game.player2 === user);
                if (game) {
                    const isGameOver = game.makeMove(user, message.move);
                }
            }
        });
    }
}
exports.GameManager = GameManager;
