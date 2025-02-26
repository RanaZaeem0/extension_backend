import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import { Document } from "mongoose";
import cookieParser from "cookie-parser"
import express, { Request, Response } from "express"
import { userRoute } from "./routes/user.route"
import cors from "cors"
import mongoSanitize from "express-mongo-sanitize"
import passport from "./middleware/passport"
import session from "express-session"
import User from "./models/user.model"
import connectDB from "./db";
dotenv.config({
  path:'./.env'
})

const app  = express()

connectDB()
app.use(express.json({ limit: '16kb' }))
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))
app.use(cookieParser())
app.use(mongoSanitize())
app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false, // Change to false
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "PRODUCTION" , // Only secure in production
    sameSite: process.env.NODE_ENV === "PRODUCTION" ? "none" : "none",
  }
}));

app.use(passport.initialize());
app.use(passport.session());





app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "https://betasender.vercel.app"
      ],
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
}))


app.use('/auth',userRoute)

app.use('/api/v1/test',(req:Request,res:Response)=>{
    res.status(200).json({
        message:'hello'
    })
})

const PORT = process.env.PORT || 8000

app.listen(8000,()=>{
    console.log(`server is running on port ${PORT}`)
  })