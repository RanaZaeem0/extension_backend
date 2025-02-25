import express, { Request, Response } from "express"
import { verifyJwt } from "../middleware/auth.middleware"
import { loginUser } from "../controllers/user.controller"
import { googleAuthCallback, loginSuccess } from "../auth/user.auth"
import passport from "passport"

const userRoute  = express.Router()


userRoute.get('/login/success',verifyJwt,loginUser)
userRoute.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
userRoute.get("/google/callback", passport.authenticate("google", { failureRedirect: process.env.CLIENT_URL + "/login" }), googleAuthCallback);
userRoute.get('/usertest',(req:Request,res:Response)=>{
res.json({
    msg:"hello"
})
})



export {userRoute}