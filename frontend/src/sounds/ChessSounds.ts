import { Castle } from "@mui/icons-material";

export const ChessSounds = {
  MOVE: new Audio("/sounds/move.mp3"),
  CAPTURE: new Audio("/sounds/capture.mp3"),
  CHECK: new Audio("/sounds/check.mp3"),
  CASTLE: new Audio("/sounds/castle.mp3"),
  CHECKMATE: new Audio("/sounds/checkmate.mp3"),
  GAME_START: new Audio("/sounds/gameStart.mp3"),
  GAME_END: new Audio("/sounds/gameEnd.mp3"),
};

Object.values(ChessSounds).forEach(sound => sound.load());