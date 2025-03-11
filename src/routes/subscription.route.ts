import express, { Request, Response } from "express";
import { subscriptionController } from "../controllers/subscription.controller";




const subscriptionRoute = express.Router()


subscriptionRoute.post('/stripe',express.raw({ type: "application/json" }),subscriptionController)
subscriptionRoute.get('/stripe',(req:Request,res:Response)=>{
    res.json({
        msg:"hello"
    })
})


export {subscriptionRoute}