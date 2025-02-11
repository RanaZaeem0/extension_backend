import cookieParser from "cookie-parser"
import express from "express"
import { userRoute } from "./routes/user.route"
import cors from "cors"
import mongoSanitize from "express-mongo-sanitize"
const app  = express()


app.use(express.json({ limit: '16kb' }))
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))
app.use(cookieParser())
app.use(mongoSanitize())


app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "https://chat-frontend-peach.vercel.app"

      ],
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
}))


app.use('/api/v1/user',userRoute)


export default app