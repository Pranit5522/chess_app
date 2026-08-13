"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const cookie_1 = __importDefault(require("cookie"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ws_1 = require("ws");
const GameManager_1 = require("./GameManager");
const server = http_1.default.createServer(app_1.default);
const wss = new ws_1.WebSocketServer({ server });
const gameManager = new GameManager_1.GameManager();
wss.on('connection', function connection(ws, req) {
    try {
        const cookies = cookie_1.default.parse(req.headers.cookie || '');
        const token = cookies.token;
        if (!token) {
            ws.close(1008, 'Unauthorized');
            return;
        }
        const user = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        ws.user = user;
        gameManager.addUser(ws);
        console.log("New user connected.");
    }
    catch (err) {
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
