import { Request, Response, NextFunction } from "express";
import User  from "../models/user.model"; // Adjust the path to your User model
import { asyncHandler } from "../utils/asyncHandler"; // Adjust the path to your async handler
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError";

// Define the JWT payload with the _id
interface JwtPayloadWithId extends jwt.JwtPayload {
  _id: string;
}

const verifyJwt = asyncHandler(async function (req: Request, res: Response, next: NextFunction) {
  try {

    const token = req.cookies?.refreshToken || req.headers['authorization']?.replace('Bearer ', '');

    
    if (!token) {
      throw new ApiError(401, 'Unauthorized Request token');
    }
    
    const accessToken  = process.env.REFRESH_TOKEN_SECRET
    
    if(!accessToken){
      throw new ApiError(401, 'Token secret is not defined in Request');
    }    
    
    
   
    
    const validateToken = jwt.verify(token, accessToken) ;
 
    

    if (!validateToken ) {
      throw new ApiError(401, "Access token is not valid");
    }

    const user = await User.findById(validateToken).select('-password -refreshToken');
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




const socketAuthication = asyncHandler(async function (error:any, socket:any, next:NextFunction) {
  try {

    const token = socket.request.cookies?.refreshToken || socket.request.headers['authorization']?.replace('Bearer ', '');

    
    if (!token) {
      throw new ApiError(401, 'Unauthorized Request socket');
    }
    const accessToken  = process.env.REFRESH_TOKEN_SECRET
    
    if(!accessToken){
      throw new ApiError(401, 'Token secret is not defined in Request');
    }    
    

    const validateToken = jwt.verify(token, accessToken) as JwtPayloadWithId;
    if (!validateToken) {
      throw new ApiError(401, "Access token is not valid");
    }

    const user = await User.findById(validateToken._id).select('-password -refreshToken');
    if (!user) {
      throw new ApiError(440, "Cannot find the user with token id");
    }

    socket.user = user;

 return next()

  }catch (error) {
    console.error(error);
    throw new ApiError(444, "Authorization failed");
  }


});

export { verifyJwt,socketAuthication };
