"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const messages_1 = require("./messages");
const chess_js_1 = require("chess.js");
class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.moves = [];
        this.startTime = new Date();
        this.initialise_player(player1, "w");
        this.initialise_player(player2, "b");
    }
    initialise_player(player, color) {
        player.send({
            type: messages_1.INIT_GAME,
            payload: {
                color: color
            }
        });
    }
    makeMove(user, move) {
        if (this.board.turn() === "w" && this.player1 !== user) {
            return;
        }
        if (this.board.turn() === "b" && this.player2 !== user) {
            return;
        }
        try {
            this.board.move(move);
        }
        catch (e) {
            console.log(e);
            return;
        }
        if (this.board.turn() === "w") {
            this.player1.send({
                type: messages_1.MOVE,
                payload: move
            });
        }
        else {
            this.player2.send({
                type: messages_1.MOVE,
                payload: move
            });
        }
        if (this.board.isGameOver()) {
            let result;
            if (this.board.isDraw()) {
                result = "draw";
            }
            else {
                result = this.board.turn() === "w" ? "black" : "white";
            }
            this.player1.markPlaying(false);
            this.player1.send({
                type: messages_1.GAME_OVER,
                payload: {
                    result: result
                }
            });
            this.player2.markPlaying(false);
            this.player2.send({
                type: messages_1.GAME_OVER,
                payload: {
                    result: result
                }
            });
            return;
        }
    }
}
exports.Game = Game;
