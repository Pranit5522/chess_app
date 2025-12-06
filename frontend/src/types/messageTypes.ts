export const MessageType = {
    INIT_GAME: "init_game",
    GAME_OVER: "game_over",
    MOVE: "move",
} as const;

export type MessageType = "init_game" | "game_over" | "move";