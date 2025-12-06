import { WebSocketServer } from 'ws';
import { GameManager } from './GameManager';

const wss = new WebSocketServer({ port: 8080 });
const gameManager = new GameManager();

wss.on('connection', function connection(ws) {
  gameManager.addUser(ws);
  console.log("New user connected.");

  ws.on('close', () => {
    console.log("User disconnected.");
    gameManager.removeUser(ws);
  });
});