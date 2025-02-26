import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import zod from "zod"
import User from "../models/user.model";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import mongoose from "mongoose";
import { cookieOptions } from "../lib/constant";


const registerUser = asyncHandler(async (req: Request, res: Response) => {

  const UserDataCheck = zod.object({
    email: zod.string().min(2),
    name: zod.string(),
    password: zod.string().optional(),
  });

  //   take data from frontend
  const { email, password, name } = req.body;

  const validate = UserDataCheck.safeParse({
    email: email,
    password: password,
    name: name,
  });



  if (!validate.success) {
    throw new ApiError(400, validate.error.message);
  }

  const findUser = await User.findOne({ email })
  if (findUser) {
    throw new ApiError(402, "User already exist")
  }


  const createUser = await User.create({ email, password , name })

  if (!createUser) {
    throw new ApiError(403, "User not created")
  }
  res.status(201).json(
    new ApiResponse(201, createUser, "User created successfully")
  )


})

const loginUser = asyncHandler(async (req: Request, res: Response) => {

  const user  = req.user

  if(!user ){
    throw new ApiError(400, "User not found")
  }

  res.status(201).json(
    new ApiResponse(201,user, "User login successfully")
  )
})

const getUserDetails = asyncHandler(async () => {

})


const logOut = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  // Clear cookies by setting them to an empty value and expiring them immediately
  res.clearCookie("accessToken", cookieOptions);

  res.clearCookie("refreshToken", cookieOptions);

  return res.status(200).json(new ApiResponse(200, null, "User logged out successfully"));
});


export { registerUser, getUserDetails, loginUser, logOut }