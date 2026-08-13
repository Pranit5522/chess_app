import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.cookies?.token;

    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    next();
};