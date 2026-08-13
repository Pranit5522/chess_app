import express from 'express';
import cors from 'cors';
import authRouter from './modules/user/routes';

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use('/api/users', authRouter);

export default app;
