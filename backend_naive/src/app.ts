import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import authRouter from './modules/user/routes';

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use('/api/users', authRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

export default app;
