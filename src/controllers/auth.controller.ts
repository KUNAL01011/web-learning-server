import { NextFunction, Request, Response } from "express";
import userModel from "../models/user.model";
import ErrorHandler from "../customResponses/ErrorHandler";
import { CatchAsyncError } from "../utils/asyncHandler";
import ejs from 'ejs';
import path from "path";
import sendMail from "../utils/sendMail";
import { accessTokenOptions, refreshTokenOptions, sendToken } from "../utils/jwt";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
//Register
// taking the data like [email, name, password] 
// if the email is already exist but not verified replace the data with new one
// send the mail to verify the account with the otp


//=== How verification work ===
//we send the token and otp and when the user return back to the user and check the otp with saved otp in db
// and erase the otp after verify it.

//login
//take the data like [email and password]
// generate the access and refresh token and save to the browser

//logout
// clear all cookies on the browser 
// when i generate the token i simpliy add a versiontoken key 
//in the database

//forword password
//first enter the email and recevie an email with link
//click on the link give the passowrd 
//save it login with new password



//register user
interface IRegistrationBody {
    name: string;
    email: string;
    password: string;
};

export const registrationUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body as IRegistrationBody;

        const isEmailExist = await userModel.findOne({ email });

        if (isEmailExist && isEmailExist.isVerified) {
            return next(new ErrorHandler("User is already exist", 400));
        }
        else if (isEmailExist) {
            await userModel.findByIdAndDelete(isEmailExist._id);
        }

        const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

        const user = await userModel.create({
            name,
            email,
            password,
            verificationOtp: activationCode,
        });

        const data = { user: { name: user.name }, activationCode };

        const html = await ejs.renderFile(path.join(__dirname, "../mails/activation-mail.ejs"), data);

        try {
            await sendMail({
                email: user.email,
                subject: "Activate your account",
                template: "activation-mail.ejs",
                data,
            });

            res.status(201).json({
                success: true,
                message: `Please check your email : ${user.email}`,
                userId: user._id
            });
        }
        catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }
    }
    catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});


// Activate user
interface IActivationRequest {
    activation_code: string;
}
export const activateUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { activation_code } = req.body as IActivationRequest;
        const { userId } = req.body;


        const user = await userModel.findById(userId);

        if(!user){
            return next(new ErrorHandler("User is not exist", 400))
        }

        if(user.verificationOtp !== activation_code){
            return next(new ErrorHandler("Invalid otp",400));
        }

        user.isVerified = true;
        user.verificationOtp = "";

        await user.save();

        res.status(201).json({
            success: true,
        });
    }
    catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});


// login user
interface ILoginRequest {
    email: string;
    password: string;
}
export const loginUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body as ILoginRequest;

        if (!email || !password) {
            return next(new ErrorHandler("Please enter email and password", 400));
        }

        const user = await userModel.findOne({ email }).select("+password");

        if (!user) {
            return next(new ErrorHandler("Invaild email or password", 400));
        };

        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return next(new ErrorHandler("Invaild email or password", 400));
        };

        sendToken(user, 200, res);

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});


// logout user
export const logoutUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.clearCookie('access_token',{
            httpOnly: true,
            secure: true, // Only send over HTTPS
            sameSite: "none", // Enable cross-origin cookies
        });
        res.clearCookie('refresh_token',{
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        // redis.del(userId);
        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});


//social auth
interface ISocialAuthBody {
    email: string;
    name: string;
    avatar: string;
}
export const socailAuth = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, name, avatar } = req.body as ISocialAuthBody;
        const user = await userModel.findOne({ email });

        if (!user) {
            const newUser = await userModel.create({ email, name, avatar });
            sendToken(newUser, 200, res);
        }
        else {
            sendToken(user, 200, res);
        }
    }
    catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});


//update access token 
export const updateAccessToken = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refresh_token = req.cookies.refresh_token as string;
        const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN as string) as JwtPayload;

        if (!decoded) {
            return next(new ErrorHandler('Could not refresh token', 400));
        }

        const user = await userModel.findById(decoded.id);

        if(!user){
            return next(new ErrorHandler('User not exist', 400));
        }

        const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN as string, { expiresIn: "5m" });
        const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN as string, { expiresIn: "3d", });

        //tsignore
        req.user = user;

        res.cookie("access_token", accessToken, accessTokenOptions);
        res.cookie("refresh_token", refreshToken, refreshTokenOptions);
        // await redis.set(user._id,JSON.stringify(user),"EX",604800);

        return next();
    }
    catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});
