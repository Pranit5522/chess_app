import { useEffect, useState, useRef } from "react";
import { Navbar } from "../components/Navbar";
import { JoinGame } from "../components/JoinGame";
import { Chessboard } from "../components/Chessboard";
import { useSocket } from "../hooks/useSocket";
import { MessageType } from "../types/messageTypes";
import { Chess, type PieceSymbol, type Square, type Color } from "chess.js";

export const Game = () => {
    const ws: null | WebSocket = useSocket();
    const [playing, setPlaying] = useState(false);
    const chessRef = useRef<Chess>(new Chess());
    const [board, setBoard] = useState<({ square: Square; type: PieceSymbol; color: Color; } | null)[][]>(chessRef.current.board());
    

    useEffect(() => {
        if (ws === null) return;

        ws.onmessage = (event: MessageEvent) => {
            const message = JSON.parse(event.data);
            console.log("Received message:", message);
            
            switch (message.type) {
                case MessageType.INIT_GAME:
                    chessRef.current = new Chess();
                    setBoard(chessRef.current.board());
                    setPlaying(true);

                    break;

                case MessageType.MOVE:
                    const move = message.payload;
                    chessRef.current.move(move);
                    setBoard(chessRef.current.board());
                    
                    break;

                case MessageType.GAME_OVER:
                    console.log("Game is over!");
                    break;
                default:
                    console.log("Unknown message type:", message.type);
            }
        }

        return () => {
            ws.onmessage = null;
        };

    }, [ws]);

    return (
        <>
            <Navbar />
            {(!playing && ws !== null) && <div style={{ backgroundColor: "orange" }}>Connecting to server...</div>}
            <div className="game">
                <Chessboard board={board} setBoard={setBoard} chessRef={chessRef} />
                <JoinGame ws={ws} />
            </div>
        </>
    );
}