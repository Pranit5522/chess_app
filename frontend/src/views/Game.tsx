import { useEffect, useState, useRef } from "react";
import { Navbar } from "../components/Navbar";
import { JoinGame } from "../components/JoinGame";
import { Chessboard } from "../components/Chessboard";
import { MoveHistory } from "../components/MoveHistory";
import { GameOverPanel, type RematchStatus } from "../components/GameOverPanel";
import { useSocket } from "../hooks/useSocket";
import { MessageType, type ServerMessage, type GameOverPayload } from "../types/messageTypes";
import { ChessSounds } from "../sounds/ChessSounds";
import { Chess, type PieceSymbol, type Square, type Color } from "chess.js";

export const Game = () => {
    const ws: null | WebSocket = useSocket();
    const [color, setColor] = useState<Color | null>(null);
    const chessRef = useRef<Chess>(new Chess());
    const [board, setBoard] = useState<({ square: Square; type: PieceSymbol; color: Color; } | null)[][]>(chessRef.current.board());
    const [moveHistory, setMoveHistory] = useState<string[]>([]);
    const [gameResult, setGameResult] = useState<GameOverPayload | null>(null);
    const [rematchStatus, setRematchStatus] = useState<RematchStatus>("idle");
    const [opponentLeft, setOpponentLeft] = useState(false);

    useEffect(() => {
        if (ws === null) return;

        ws.onmessage = (event: MessageEvent) => {
            const message: ServerMessage = JSON.parse(event.data);
            console.log("Received message:", message);

            switch (message.type) {
                case MessageType.INIT_GAME:
                    chessRef.current = new Chess();
                    setBoard(chessRef.current.board());
                    setMoveHistory([]);
                    setGameResult(null);
                    setRematchStatus("idle");
                    setOpponentLeft(false);
                    setColor(message.payload.color);
                    ChessSounds.GAME_START.play();
                    break;

                case MessageType.MOVE:
                    chessRef.current.move(message.payload);
                    setBoard(chessRef.current.board());
                    setMoveHistory(chessRef.current.history());
                    break;

                case MessageType.GAME_OVER:
                    setGameResult(message.payload);
                    break;

                case MessageType.REMATCH_REQUESTED:
                    setRematchStatus("opponent_requested");
                    break;

                case MessageType.OPPONENT_LEFT:
                    setOpponentLeft(true);
                    break;

                default:
                    console.log("Unknown message type:", message);
            }
        }

        return () => {
            ws.onmessage = null;
        };

    }, [ws]);

    const requestRematch = () => {
        ws?.send(JSON.stringify({ type: MessageType.REMATCH }));
        setRematchStatus("you_requested");
    };

    const findNewGame = () => {
        ws?.send(JSON.stringify({ type: MessageType.INIT_GAME }));
    };

    return (
        <>
            <Navbar />
            <div className="game">
                <Chessboard
                    board={board}
                    setBoard={setBoard}
                    setMoveHistory={setMoveHistory}
                    chessRef={chessRef}
                    color={color}
                    ws={ws}
                />
                {color === null ? (
                    <JoinGame ws={ws} />
                ) : (
                    <div className="game-menu">
                        <MoveHistory moves={moveHistory} />
                        {(gameResult || opponentLeft) && (
                            <GameOverPanel
                                result={gameResult}
                                rematchStatus={rematchStatus}
                                opponentLeft={opponentLeft}
                                onRematch={requestRematch}
                                onFindNewGame={findNewGame}
                            />
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
