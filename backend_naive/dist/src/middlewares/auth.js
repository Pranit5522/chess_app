"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const authMiddleware = (req, res, next) => {
    var _a;
    const authHeader = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
};
exports.authMiddleware = authMiddleware;
