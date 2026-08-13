import http from 'http';
import app from './app';
import cookie from "cookie";
import jwt from 'jsonwebtoken';
import { WebSocketServer } from 'ws';
import { GameManager } from './GameManager';

const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const gameManager = new GameManager();

wss.on('connection', function connection(ws, req) {
  try {
    const cookies = cookie.parse(req.headers.cookie || '');
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

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
