import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import connectDB from "./config/db.config.js"
import { indexRouter } from "./routes/index.routes.js"
import { userRouter } from "./routes/user.routes.js"

dotenv.config({ path: "./.env" })

const app = express()
const port = process.env.PORT

connectDB()

const allowedOrigins = [
    process.env.FRONT_URL,
    'http://localhost:5174/'
]

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))

app.use(cookieParser())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', indexRouter)
app.use('/user', userRouter)

app.listen(port, () => {
    console.log('Express is running')
})