import express from "express"
import { verifyJwt } from "../middleware/auth.middleware"
import { registerUser } from "../controllers/user.controller"

const userRoute  = express.Router()


userRoute.post('/register',registerUser)




export {userRoute}