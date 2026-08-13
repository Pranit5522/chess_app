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
exports.verifyPassword = exports.findUserByUsername = exports.findUserByEmail = exports.createUser = void 0;
const prisma_1 = require("../../config/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const createUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcrypt_1.default.hash(data.password, 10);
    return prisma_1.prisma.user.create({
        data: {
            email: data.email.toLowerCase(),
            username: data.username,
            password: hashedPassword,
        }
    });
});
exports.createUser = createUser;
const findUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.prisma.user.findUnique({ where: { email: email.toLowerCase() } });
});
exports.findUserByEmail = findUserByEmail;
const findUserByUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.prisma.user.findUnique({ where: { username } });
});
exports.findUserByUsername = findUserByUsername;
const verifyPassword = (plain, hashed) => __awaiter(void 0, void 0, void 0, function* () {
    return bcrypt_1.default.compare(plain, hashed);
});
exports.verifyPassword = verifyPassword;
