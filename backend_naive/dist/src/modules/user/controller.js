"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../../config/prisma");
const service_1 = require("./service");
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, username, password } = req.body;
    const user = yield (0, service_1.findUserByEmail)(email);
    if (user) {
        return res.status(401).json({ message: "Email already exists" });
    }
    const existingUsername = yield (0, service_1.findUserByUsername)(username);
    if (existingUsername) {
        return res.status(401).json({ message: "Username already exists" });
    }
    const newUser = yield (0, service_1.createUser)({ email, username, password });
    return res.json({
        success: true,
        message: "User registered successfully",
        user: {
            id: newUser.id,
            email: newUser.email,
            username: newUser.username,
        }
    });
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, password } = req.body;
    const user = yield prisma_1.prisma.user.findUnique({
        where: { email }
    });
    if (!user) {
        return res.status(401).json({ message: "Email doesnt exist" });
    }
    if (user.password) {
        const match = yield bcrypt_1.default.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: "Incorrect password" });
        }
    }
    else {
        // Outh users
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.json({
        success: true,
        message: "Login successful",
        token,
        user: {
            id: user.id,
            email: user.email,
            username: user.username,
        }
    });
});
exports.loginUser = loginUser;
