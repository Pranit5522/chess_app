import React, { useState, useEffect } from "react";
import { ChessSounds } from "../sounds/ChessSounds";
import { MessageType } from "../types/messageTypes";
import {Chess, type PieceSymbol, type Square, type Color, type Move } from "chess.js";
import { PromotionChoice } from "./PromotionChoice";

export const Chessboard = ({
  board,
  chessRef,
  setBoard,
  color,
  ws,
}: {
  board: ({ square: Square; type: PieceSymbol; color: Color; } | null)[][],
  chessRef: React.RefObject<Chess>,
  setBoard: React.Dispatch<React.SetStateAction<({ square: Square; type: PieceSymbol; color: Color; } | null)[][]>>,
  color: Color | null,
  ws: WebSocket | null,
}) => {
    const [fromSquare, setFromSquare] = useState<Square | null>(null);
    const [possibleMoves, setPossibleMoves] = useState<Move[]>([]);
    const [lastMove, setLastMove] = useState<Move | null>(null);
    const [promotionMove, setPromotionMove] = useState<{rowIndex: number; colIndex: number} | null>(null);

    // Helpers to convert between board indices and chess squares
    const convertIndexToSquare = (rowIndex: number, colIndex: number): Square => {
        const file = String.fromCharCode("a".charCodeAt(0) + colIndex);
        const rank = (8 - rowIndex).toString();
        return (file + rank) as Square;
    };

    const convertSquareToIndex = (move: string): { rowIndex: number; colIndex: number } => {
        const file = move.charAt(0);
        const rank = move.charAt(1);

        const colIndex = file.charCodeAt(0) - 'a'.charCodeAt(0);
        const rowIndex = 8 - parseInt(rank);

        return { rowIndex, colIndex };
    }

    useEffect(() => {
        console.log(possibleMoves);
    }, [possibleMoves]);

    // useEffect to play sounds on lastMove change
    useEffect(() => {
        if (!lastMove) return;

        if (chessRef.current.isGameOver()) {
            ChessSounds.GAME_END.play();
        }
    
        if (chessRef.current.inCheck()) {
            ChessSounds.CHECK.play();
        } else if (lastMove.isKingsideCastle() || lastMove.isQueensideCastle()) {
            ChessSounds.CASTLE.play();
        }  else if (lastMove.isCapture()) {
            ChessSounds.CAPTURE.play();
        } else {
            ChessSounds.MOVE.play();
        }
    }, [lastMove]);

    // Handle piece selection and movement
    const handlePieceSelect = (rowIndex: number, colIndex: number, promotion: string | undefined = undefined) => {
        if(promotionMove && !promotion) {
            return; // Wait for promotion choice
        }

        const square = convertIndexToSquare(rowIndex, colIndex);

        if (
            board[rowIndex][colIndex]?.color === color
            && chessRef.current.turn() === color
        ) {
            const moves = chessRef.current.moves({ square, verbose: true });
            
            // Highlight possible moves
            setFromSquare(square);
            setPossibleMoves(moves);

            // Return early to allow move selection
            return;

        } else if (fromSquare) {
            const move = possibleMoves.find(m => {
                const moveIndices = convertSquareToIndex(m.to);
                return moveIndices.rowIndex === rowIndex && moveIndices.colIndex === colIndex;
            });

            if (move) {
                if(!promotion && move.isPromotion()) {
                    // Handle promotion
                    setPromotionMove({rowIndex, colIndex})
                    return;
                } else {
                    // Update game state
                    chessRef.current.move({ from: fromSquare, to: move.to, promotion: promotion });
                    setLastMove(move);
                    setBoard(chessRef.current.board());
                    setPromotionMove(null);

                    // Send move to server
                    ws?.send(JSON.stringify({
                        type: MessageType.MOVE,
                        move: {
                            from: fromSquare,
                            to: move.to,
                            promotion: promotion,
                        }
                    }));
                }
            }
        } 

        // Reset selection
        setFromSquare(null);
        setPossibleMoves([]);
    }

    return (
        <div className="game-board">
            <div className={`board ${color}`}>
                {board.map((row, rowIndex) => (
                    <div key={rowIndex} className="board-row">
                        {row.map((piece, colIndex) => ( 
                            <div 
                                key={colIndex}
                                className={
                                    `board-square 
                                    ${(rowIndex + colIndex) % 2 === 0 ? 'light-square' : 'dark-square'}
                                    ${possibleMoves.some(move => {
                                        const moveIndices = convertSquareToIndex(move.to);
                                        return moveIndices.rowIndex === rowIndex 
                                        && moveIndices.colIndex === colIndex;
                                    }) && 'possible-move'}
                                    ${fromSquare === convertIndexToSquare(rowIndex, colIndex) && 'selected-square'}`
                                }
                                onClick={color && ws ? () => handlePieceSelect(rowIndex, colIndex) : undefined}
                            >
                                {piece && (
                                    <img 
                                        className={`piece-image ${color}`} 
                                        src={`/pieces/${piece.color}${piece.type}.svg`} 
                                        alt={`${piece.color} ${piece.type}`}
                                        draggable={false}
                                    />
                                )}
                                {promotionMove && promotionMove.rowIndex === rowIndex && promotionMove.colIndex === colIndex && (
                                    <PromotionChoice onSelect={(promotion) => handlePieceSelect(rowIndex, colIndex, promotion)} />
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}