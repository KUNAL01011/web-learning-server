import express from 'express';
import { createLayout, editLayout, getLayoutByType } from '../controllers/layout.controller';
import { authorizeRoles, isAuthenticated } from '../middlewares/auth';
const layoutRouter = express.Router();

layoutRouter.post("/create-layout",createLayout);
layoutRouter.put("/edit-layout",isAuthenticated,authorizeRoles("admin"),editLayout);
layoutRouter.get("/get-layout/:type",getLayoutByType);

export default layoutRouter;