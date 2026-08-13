import WebSocket from "ws";
import { GAME_OVER, INIT_GAME, MOVE, REMATCH_REQUESTED } from "./messages";
import { Chess, Color, Move } from "chess.js";
import { User } from "./User";

export class Game {
    public player1: User;
    public player2: User;
    private board: Chess;
    private startTime: Date;
    private rematchReady: { player1: boolean; player2: boolean };

    constructor(player1: User, player2: User) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();
        this.rematchReady = { player1: false, player2: false };
        this.initialise_player(player1, "w");
        this.initialise_player(player2, "b");
    }

    initialise_player(player: User, color: string) {
        player.send({
            type: INIT_GAME,
            payload: {
                color: color
            }
        });
    }

    makeMove(user: User, move: {from: string, to: string, promotion?: string | undefined}) {
        if (this.board.turn() === "w" && this.player1 !== user){
            return;
        }
        if (this.board.turn() === "b" && this.player2 !== user){
            return;
        }

        let played: Move;
        try {
            played = this.board.move(move);
        }
        catch(e){
            console.log(e);
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

        if(this.board.isGameOver()){
            let reason: string;
            let winner: Color | null;

            if(this.board.isCheckmate()) {
                reason = "checkmate";
                winner = played.color;
            } else if(this.board.isStalemate()) {
                reason = "stalemate";
                winner = null;
            } else if(this.board.isThreefoldRepetition()) {
                reason = "threefold_repetition";
                winner = null;
            } else if(this.board.isInsufficientMaterial()) {
                reason = "insufficient_material";
                winner = null;
            } else {
                reason = "fifty_move_rule";
                winner = null;
            }

            this.player1.markPlaying(false);
            this.player1.send({
                type: GAME_OVER,
                payload: { reason, winner }
            });
            this.player2.markPlaying(false);
            this.player2.send({
                type: GAME_OVER,
                payload: { reason, winner }
            });
            return;
        }
    }

    requestRematch(user: User) {
        if(user === this.player1) {
            this.rematchReady.player1 = true;
        } else if(user === this.player2) {
            this.rematchReady.player2 = true;
        } else {
            return;
        }

        if(this.rematchReady.player1 && this.rematchReady.player2) {
            this.board = new Chess();
            this.rematchReady = { player1: false, player2: false };
            this.player1.markPlaying(true);
            this.player2.markPlaying(true);
            this.initialise_player(this.player1, "w");
            this.initialise_player(this.player2, "b");
            return;
        }

        const opponent = user === this.player1 ? this.player2 : this.player1;
        opponent.send({ type: REMATCH_REQUESTED, payload: {} });
    }
}