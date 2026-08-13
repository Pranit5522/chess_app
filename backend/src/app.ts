import express from 'express';
import authRouter from './modules/user/routes';

const app = express();

app.use(express.json());
app.use('/api/users', authRouter);

export default app;
