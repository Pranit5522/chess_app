import WebSocket from "ws";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";
import { Chess } from "chess.js";
import { User } from "./User";

export class Game {
    public player1: User;
    public player2: User;
    private board: Chess;
    private moves: string[];
    private startTime: Date;

    constructor(player1: User, player2: User) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.moves = [];
        this.startTime = new Date();
        this.initialise_player(player1, "white");
        this.initialise_player(player2, "black");
    }

    initialise_player(player: User, color: string) {
        player.send({
            type: INIT_GAME,
            payload: {
                color: color
            }
        });
    }

    makeMove(user: User, move: {from: string, to: string}){
        if (this.board.turn() === "w" && this.player1 !== user){
            return;
        }
        if (this.board.turn() === "b" && this.player2 !== user){
            return;
        }

        try {
            this.board.move(move);
        }
        catch(e){
            console.log(e);
            return;
        }

        if(this.board.isGameOver()){
            let result: string;
            if(this.board.isDraw()) {
                result = "draw";
            } else {
                result = this.board.turn() === "w" ? "black" : "white";
            }
            this.player1.markPlaying(false);
            this.player1.send({
                type: GAME_OVER,
                payload: {
                    result: result
                }
            });
            this.player2.markPlaying(false);
            this.player2.send({
                type: GAME_OVER,
                payload: {
                    result: result
                }
            });
            return;
        }

        if(this.board.turn() === "w"){
            this.player1.send({
                type: MOVE,
                payload: move
            })
        } else {
            this.player2.send({
                type: MOVE,
                payload: move
            })
        }
    }
}