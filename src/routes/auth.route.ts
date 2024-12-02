import express from 'express';
import { activateUser, loginUser, logoutUser, registrationUser, socailAuth } from '../controllers/auth.controller';
import { isAuthenticated } from '../middlewares/auth';
const authRouter = express.Router();

authRouter.post('/registration',registrationUser);
authRouter.post('/activate-user',activateUser);
authRouter.post('/login',loginUser);
authRouter.get('/logout',isAuthenticated,logoutUser);
authRouter.post("/social-auth",socailAuth);


export default authRouter;