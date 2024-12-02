import express from 'express';
import { authorizeRoles, isAuthenticated } from '../middlewares/auth';
import { deleteUser, getAllUsers, getUserInfo, updatePassword, updateProfilePicture, updateUserInfo, updateUserRole } from '../controllers/user.controller';

const userRouter = express.Router();

userRouter.get("/me", isAuthenticated,getUserInfo);
userRouter.put("/update-user-info",isAuthenticated,updateUserInfo);
userRouter.put("/update-user-password",isAuthenticated,updatePassword);
userRouter.put("/update-user-avatar",isAuthenticated,updateProfilePicture);
userRouter.get("/get-users",isAuthenticated,authorizeRoles("admin"),getAllUsers);
userRouter.put("/update-user",isAuthenticated,authorizeRoles("admin"),updateUserRole);
userRouter.delete("/delete-user/:id",isAuthenticated,authorizeRoles("admin"),deleteUser);

export default userRouter;