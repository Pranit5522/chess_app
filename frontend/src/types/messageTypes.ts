import type { Color } from "chess.js";

export const MessageType = {
    INIT_GAME: "init_game",
    GAME_OVER: "game_over",
    MOVE: "move",
    REMATCH: "rematch",
    REMATCH_REQUESTED: "rematch_requested",
    OPPONENT_LEFT: "opponent_left",
} as const;

export type MessageType = typeof MessageType[keyof typeof MessageType];

export interface InitGamePayload {
    color: Color;
}

export interface MovePayload {
    from: string;
    to: string;
    promotion?: string;
}

export type GameOverReason =
    | "checkmate"
    | "stalemate"
    | "threefold_repetition"
    | "insufficient_material"
    | "fifty_move_rule";

export interface GameOverPayload {
    reason: GameOverReason;
    winner: Color | null;
}

export type RematchRequestedPayload = Record<string, never>;
export type OpponentLeftPayload = Record<string, never>;

export type ServerMessage =
    | { type: typeof MessageType.INIT_GAME; payload: InitGamePayload }
    | { type: typeof MessageType.MOVE; payload: MovePayload }
    | { type: typeof MessageType.GAME_OVER; payload: GameOverPayload }
    | { type: typeof MessageType.REMATCH_REQUESTED; payload: RematchRequestedPayload }
    | { type: typeof MessageType.OPPONENT_LEFT; payload: OpponentLeftPayload };
