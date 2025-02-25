import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/apiResponse";
import { cookieOptions } from "../lib/constant";
dotenv.config()

const generateAccessToken = (user: any) => {
    return jwt.sign({ id: user._id, email: user.email }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "6h" })
}


const generateRefreshToken = (user: any) => {
    return jwt.sign({ id: user._id, email: user.email }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: "7d" })
}


//function run after user successfully authenticated with google
const googleAuthCallback = asyncHandler(async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ error: true, message: "Not authorized" });
        }
        console.log(req.user, "user data");

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);


        res.cookie("refreshToken", refreshToken, cookieOptions);
        res.cookie("accessToken", accessToken, cookieOptions);

        // Redirect to client profile page
        return res.redirect(`${process.env.CLIENT_URL}/profile`);




    } catch (error) {
        console.error("Google Auth Error:", error);
        res.status(500).json({ error: true, message: "Authentication error" });
    }
})


const loginSuccess = (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(200).json({
            error: true, // Changed to 'true' because user is not authenticated
            message: "User not authenticated",
            user: null,
            accessToken: null
        });
    }

    // Generate token only when the user is authenticated
    const accessToken = generateAccessToken(req.user);

    res.status(200).json({
        success: true,
        message: "Login successful",
        user: req.user,
        accessToken: accessToken // Correct token usage
    });
};
;

const refreshAccessToken = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ error: true, message: "Unauthorized" });
        }

        // Verify Refresh Token
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, (err: any, decoded: any) => {
            if (err) {
                return res.status(403).json({ error: true, message: "Invalid refresh token" });
            }

            // Generate New Access Token
            const newAccessToken = generateAccessToken({ _id: decoded.id, email: decoded.email });

            // Set New Access Token in Cookie
            res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "none",
                path: "/",
                maxAge: 6 * 60 * 60 * 1000, // 6 hours
            });

            res.status(200).json({ error: false, accessToken: newAccessToken });
        });
    } catch (error) {
        res.status(500).json({ error: true, message: "Token refresh failed" });
    }
};


const logoutUser = (req: Request, res: Response) => {
    try {
        console.log("Logging out user...");

        // Destroy session if using express-session
        if (req.session) {
            req.session.destroy((err: any) => {
                if (err) {
                    console.error("Session Destroy Error:", err);
                    return res.status(500).json({ error: true, message: "Logout failed" });
                }
            });
        }

        // Clear cookies
        res.clearCookie("connect.sid", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            path: "/"
        });

        res.cookie("accessToken", "", { expires: new Date(0), path: "/" });
        res.cookie("refreshToken", "", { expires: new Date(0), path: "/" });

        console.log("Cookies cleared, session destroyed.");

        return res.json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ error: true, message: "Logout failed" });
    }
};




const logoutGoogleUser = (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("Logging out Google user...");

        req.logout((err) => {
            if (err) {
                console.error("Logout Error:", err);
                return next(err);
            }

            // Clear session cookie
            res.clearCookie("connect.sid", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production" ? true : false,
                sameSite: "none",
                path: "/",
            });

            return res.json({ success: true, message: "Google Logged out successfully" });
        });
    } catch (error) {
        console.error("Google Logout Error:", error);
        res.status(500).json({ error: true, message: "Google Logout failed" });
    }
};


export { googleAuthCallback, loginSuccess, refreshAccessToken, logoutUser, logoutGoogleUser };