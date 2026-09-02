import http from 'http';
import app from './app';
import { parse as parseCookies } from "cookie";
import jwt from 'jsonwebtoken';
import { WebSocketServer } from 'ws';
import { GameManager } from './GameManager';

const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const gameManager = new GameManager();

wss.on('connection', function connection(ws, req) {
  try {
    const cookies = parseCookies(req.headers.cookie || '');
    const token = cookies.token;

    if (!token) {
      ws.close(1008, 'Unauthorized');
      return;
    }

    const user = jwt.verify(token, process.env.JWT_SECRET!);
    (ws as any).user = user;

    gameManager.addUser(ws);
    console.log("New user connected.");

  } catch (err) {
    ws.close(1008, 'Unauthorized');
    return;
  }

  ws.on('close', () => {
    console.log("User disconnected.");
    gameManager.removeUser(ws);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
