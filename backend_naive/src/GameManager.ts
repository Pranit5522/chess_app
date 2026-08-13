import WebSocket from "ws";
import { INIT_GAME, MOVE, REMATCH, OPPONENT_LEFT } from "./messages";
import { Game } from "./Game";
import { User } from "./User";

export class GameManager {
    private games: Game[];
    private pendingUser: User | null;
    private users: User[];

    constructor(){
        this.games = [];
        this.users = [];
        this.pendingUser = null;
    }

    addUser(ws: WebSocket) {
        const user = new User(ws);
        this.users.push(user);
        this.addHandler(user);
    }

    removeUser(ws: WebSocket) {
        const user = this.users.find(user => user.getSocket() === ws);
        this.users = this.users.filter(user => user.getSocket() !== ws);
        if (!user) return;

        if (this.pendingUser === user) {
            this.pendingUser = null;
        }

        const game = this.games.find(game => game.player1 === user || game.player2 === user);
        if (game) {
            const opponent = game.player1 === user ? game.player2 : game.player1;
            opponent.markPlaying(false);
            opponent.send({ type: OPPONENT_LEFT, payload: {} });
            this.games = this.games.filter(g => g !== game);
        }
    }

    private addHandler(user: User) {
        const ws = user.getSocket();
        ws.on("message", (data) => {
            const message = JSON.parse(data.toString());
            if(message.type === INIT_GAME) {
                if(user.isPlaying) {
                    return;
                }
                user.markPlaying(true);
                if(this.pendingUser) {
                    const game = new Game(this.pendingUser, user);
                    this.games.push(game);
                    this.pendingUser = null;
                } else {
                    this.pendingUser = user;
                }
            }

            if(message.type === MOVE) {
                const game = this.games.find(game => game.player1 === user || game.player2 === user);
                if(game){
                    game.makeMove(user, message.move);
                }
            }

            if(message.type === REMATCH) {
                const game = this.games.find(game => game.player1 === user || game.player2 === user);
                if(game){
                    game.requestRematch(user);
                }
            }
        })
    }
}