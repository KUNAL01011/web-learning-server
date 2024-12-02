import { NextFunction,Response,Request } from "express";
import { CatchAsyncError } from "../utils/asyncHandler";
import ErrorHandler from "../customResponses/ErrorHandler";
import userModel from "../models/user.model";
import { getAllUsersService, getUserById, updateUserRoleService } from "../services/user.service";
import cloudinary from 'cloudinary';

// get user info
export const getUserInfo = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id;
        getUserById(userId, res);
    }
    catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});


//update user info
interface IUpdateUserInfo {
    name?: string;
    email?: string;
};

export const updateUserInfo = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body as IUpdateUserInfo;
        const userId = req.user?._id;
        const user = await userModel.findById(userId);
        if (name && user) {
            user.name = name;
        }
        await user?.save();
        // await redis.set(userId, JSON.stringify(user));
        res.status(201).json({
            success: true,
            user,
        });
    }
    catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});



//update user password
interface IUpdatePassword {
    oldPassword: string;
    newPassword: string;
}

export const updatePassword = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { oldPassword, newPassword } = req.body as IUpdatePassword;

        if (!oldPassword || !newPassword) {
            return next(new ErrorHandler("Please enter old and new password", 400));
        }
        //this line give me problem ..4:06:51
        const user = await userModel.findById(req.user?._id).select("+password");

        if (user?.password === undefined) {
            return next(new ErrorHandler("Invaild user", 400));
        }

        const isPasswordMatch = await user?.comparePassword(oldPassword);

        if (!isPasswordMatch) {
            return next(new ErrorHandler("Invalid old password", 400));
        }

        user.password = newPassword;

        await user.save();

        // await redis.set(req.user?._id, JSON.stringify(user));

        res.status(201).json({
            success: true,
            user,
        });

    }
    catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})


// update profile picture
interface IUpdateProfilePicture {
    avatar: string;
}
export const updateProfilePicture = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { avatar } = req.body as IUpdateProfilePicture;


        const userId = req.user?._id;


        const user = await userModel.findById(userId);

        if (avatar && user) {
            if (user?.avatar?.public_id) {
                await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);

                const myCloud = await cloudinary.v2.uploader.upload(avatar, {
                    folder: "avatars",
                    width: 150,
                });
                user.avatar = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                };

            }
            else {
                const myCloud = await cloudinary.v2.uploader.upload(avatar, {
                    folder: "avatars",
                    width: 150,
                });
                user.avatar = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                };
            }
        }

        await user?.save();

        // await redis.set(userId, JSON.stringify(user));

        res.status(200).json({
            success: true,
            user,
        });

    }
    catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});


// get all users --- only for admin
export const getAllUsers = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        getAllUsersService(res);
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})

//update user role --only for admin
export const updateUserRole = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {email, role } = req.body;
        const isUserExist = await userModel.findOne({email});
        if(isUserExist){
            const id = isUserExist._id;
            updateUserRoleService(res, id, role);
        }
        else{
            res.status(400).json({
                success:false,
                message:"User not found"
            })
        }
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})

// Delete user -- only for admin
export const deleteUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const user = await userModel.findById(id);

        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        await user.deleteOne({ id });

        // await redis.del(id);

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})


