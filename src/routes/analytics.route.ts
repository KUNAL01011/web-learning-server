import express from "express";
import { getCoursesAnalytics, getOrdersAnalytics, getUsersAnalytics } from "../controllers/analytics.controller";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth";
const analyticeRouter = express.Router();


analyticeRouter.get("/get-users-analytics",isAuthenticated,authorizeRoles('admin'),getUsersAnalytics);
analyticeRouter.get("/get-courses-analytics",isAuthenticated,authorizeRoles('admin'),getCoursesAnalytics);
analyticeRouter.get("/get-orders-analytics",isAuthenticated,authorizeRoles('admin'),getOrdersAnalytics);

export default analyticeRouter;