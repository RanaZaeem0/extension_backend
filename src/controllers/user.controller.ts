import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import zod from "zod"


const registerUser  = asyncHandler(async(req:Request,res:Response)=>{

    const UserDataCheck = zod.object({
        username: zod.string().min(2),
        name: zod.string(),
        password: zod.string().min(2),
      });
  
      //   take data from frontend
      const { username, password, name } = req.body;
    
      const validate = UserDataCheck.safeParse({
        username: username,
        password: password,
        name: name,
      });




})

const getUserDetails = asyncHandler(async()=>{

})

const loginUser  = asyncHandler(async()=>{


})
const logOut  = asyncHandler(async()=>{


})

export {registerUser,getUserDetails,loginUser,logOut}