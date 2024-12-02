import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import cors from "cors";
import { ErrorMiddleware } from './middlewares/error';
import authRouter from './routes/auth.route';
import courseRouter from './routes/course.route';
import orderRouter from './routes/order.route';
import notificationRouter from './routes/notification.route';
import layoutRouter from './routes/layout.route';
import analyticeRouter from './routes/analytics.route';
import userRouter from './routes/user.route';
const app = express();

//plugins
app.use(express.json({
    limit: '50mb',
}));
app.use(cookieParser());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

//routes
app.use('/api/v1', userRouter, orderRouter, courseRouter, notificationRouter, analyticeRouter, layoutRouter, authRouter);


//unknown route
app.all("*", (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Route ${req.originalUrl} not found`) as any;
    err.statusCode = 404;
    next(err);
});
app.use(ErrorMiddleware);

export default app;