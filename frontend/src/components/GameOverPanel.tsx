import type { Color } from "chess.js";
import type { GameOverPayload } from "../types/messageTypes";

export type RematchStatus = "idle" | "you_requested" | "opponent_requested";

const winnerLabel = (winner: Color | null) => {
    if (winner === "w") return "White wins";
    if (winner === "b") return "Black wins";
    return "Draw";
};

const resultText = (result: GameOverPayload) => {
    switch (result.reason) {
        case "checkmate":
            return `Checkmate - ${winnerLabel(result.winner)}`;
        case "stalemate":
            return "Stalemate - Draw";
        case "threefold_repetition":
            return "Draw - Threefold repetition";
        case "insufficient_material":
            return "Draw - Insufficient material";
        case "fifty_move_rule":
            return "Draw - Fifty-move rule";
    }
};

const rematchButtonLabel = (status: RematchStatus) => {
    switch (status) {
        case "you_requested":
            return "Waiting for opponent...";
        case "opponent_requested":
            return "Opponent wants a rematch - Accept";
        default:
            return "Rematch";
    }
};

export const GameOverPanel = ({
    result,
    rematchStatus,
    opponentLeft,
    onRematch,
    onFindNewGame,
}: {
    result: GameOverPayload | null;
    rematchStatus: RematchStatus;
    opponentLeft: boolean;
    onRematch: () => void;
    onFindNewGame: () => void;
}) => {
    return (
        <div className="game-over-panel">
            {result && <h2>{resultText(result)}</h2>}
            {opponentLeft ? (
                <>
                    <p>Opponent left the game.</p>
                    <button className="yellow-btn" onClick={onFindNewGame}>
                        <p>Find New Game</p>
                    </button>
                </>
            ) : (
                <button
                    className="yellow-btn"
                    onClick={onRematch}
                    disabled={rematchStatus === "you_requested"}
                >
                    <p>{rematchButtonLabel(rematchStatus)}</p>
                </button>
            )}
        </div>
    );
};
