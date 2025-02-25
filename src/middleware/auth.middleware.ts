import { Request, Response, NextFunction } from "express";
import User from "../models/user.model"; // Adjust the path to your User model
import { asyncHandler } from "../utils/asyncHandler"; // Adjust the path to your async handler
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError";
import mongoose from "mongoose";

// Define the JWT payload with the _id
interface JwtPayloadWithId extends jwt.JwtPayload {
  id: string;
}

const verifyJwt = asyncHandler(async function (req: Request, res: Response, next: NextFunction) {
  try {

    const token = req.cookies?.accessToken || req.headers['authorization']?.replace('Bearer ', '');


    if (!token) {
      throw new ApiError(401, 'Unauthorized Request token');
    }




    const accessToken = process.env.ACCESS_TOKEN_SECRET

    if (!accessToken) {
      throw new ApiError(401, 'Token secret is not defined in Request');
    }




    const validateToken = jwt.verify(token, accessToken) as JwtPayloadWithId;


    const userId = validateToken.id; // Extract the ID correctly

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid User ID" });
    }

    if (!validateToken) {
      throw new ApiError(401, "Access token is not valid");
    }

    const user = await User.findById(userId).select('-password ');
    if (!user) {
      throw new ApiError(440, "Cannot find the user with token id");
    }



    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    throw new ApiError(444, "Authorization failed");
  }
});




export { verifyJwt };
