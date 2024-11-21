import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import cors from "cors";
import { ErrorMiddleware } from './middlewares/error';
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


//unknown route
app.all("*", (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Route ${req.originalUrl} not found`) as any;
    err.statusCode = 404;
    next(err);
});
app.use(ErrorMiddleware);

export default app;