import React, { useState } from "react";
import { ChessSounds } from "../sounds/ChessSounds";
import {Chess, type PieceSymbol, type Square, type Color } from "chess.js";

export const Chessboard = ({
  board,
  chessRef,
  setBoard,
}: {
  board: ({ square: Square; type: PieceSymbol; color: Color; } | null)[][],
  chessRef: React.RefObject<Chess>,
  setBoard: React.Dispatch<React.SetStateAction<({ square: Square; type: PieceSymbol; color: Color; } | null)[][]>>,
}) => {
    const [fromSquare, setFromSquare] = useState<Square | null>(null);
    const [possibleMoves, setPossibleMoves] = useState<{ rowIndex: number; colIndex: number }[]>([]);

    // Helpers to convert between board indices and chess squares
    const convertIndexToSquare = (rowIndex: number, colIndex: number): Square => {
        const file = String.fromCharCode("a".charCodeAt(0) + colIndex);
        const rank = (8 - rowIndex).toString();
        return (file + rank) as Square;
    };

    const convertSquareToIndex = (move: String): { rowIndex: number; colIndex: number } => {
        const file = move.charAt(0);
        const rank = move.charAt(1);

        const colIndex = file.charCodeAt(0) - 'a'.charCodeAt(0);
        const rowIndex = 8 - parseInt(rank);

        return { rowIndex, colIndex };
    }

    // Handle piece selection and movement
    const handlePieceSelect = (rowIndex: number, colIndex: number) => {
        const square = convertIndexToSquare(rowIndex, colIndex);

        if (board[rowIndex][colIndex]?.color === chessRef.current.turn()) {
            if (board[rowIndex][colIndex] === null) {
                return;
            }
            const moves = chessRef.current.moves({ square, verbose: true });
            
            // Highlight possible moves
            setFromSquare(square);
            setPossibleMoves(
                moves.map((move) => convertSquareToIndex(move.to))
            );

            // Return early to allow move selection
            return;
        } else if (
            fromSquare &&
            possibleMoves.some(m => m.rowIndex === rowIndex && m.colIndex === colIndex)
        ) {
            const toSquare = convertIndexToSquare(rowIndex, colIndex);

            // Play appropriate sound
            if (board[rowIndex][colIndex] !== null) {
                ChessSounds.CAPTURE.play();
            } else {
                ChessSounds.MOVE.play();
            }

            // Update game state
            chessRef.current.move({ from: fromSquare, to: toSquare });
            setBoard(chessRef.current.board());
        } 

        // Reset selection
        setFromSquare(null);
        setPossibleMoves([]);
    }

    return (
        <div className="game-board">
            <div className="board">
                {board.map((row, rowIndex) => (
                    <div key={rowIndex} className="board-row">
                        {row.map((piece, colIndex) => ( 
                            <div 
                                key={colIndex}
                                className={
                                    `board-square 
                                    ${(rowIndex + colIndex) % 2 === 0 ? 'light-square' : 'dark-square'}
                                    ${possibleMoves.some(move => move.rowIndex === rowIndex && move.colIndex === colIndex) && 'possible-move'}
                                    ${fromSquare === convertIndexToSquare(rowIndex, colIndex) && 'selected-square'}`
                                }
                                onClick={() => handlePieceSelect(rowIndex, colIndex)}
                            >
                                {piece && (
                                    <img 
                                        className="piece-image" 
                                        src={`/pieces/${piece.color}${piece.type}.svg`} 
                                        alt={`${piece.color} ${piece.type}`}
                                        draggable={false}
                                    />
                                )}   
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}