import { Response } from "express";
import userModel from "../models/user.model";
// import { redis } from "../utils/redis";


//Get user by id
export const getUserById = async (userId: any, res: Response) => {
    // const userJson = await redis.get(id);
    const user = await userModel.findById(userId);
    if (user) {
        res.status(201).json({
            success: true,
            user,
        });
    }
};


// Get all users
export const getAllUsersService = async (res: Response) => {
    const users = await userModel.find().sort({ createdAt: -1 });
    res.status(201).json({
        success: true,
        users,
    });
};


//update user role
export const updateUserRoleService = async (res: Response, id: any, role: string) => {
    const user = await userModel.findByIdAndUpdate(id, { role }, { new: true });

    res.status(201).json({
        success: true,
        user,
    });
}