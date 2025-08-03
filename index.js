import dotenv from "dotenv"
import express from "express"
import connectDB from "./config/db.config.js"
import cors from "cors"
import { indexRouter } from "./routes/index.routes.js"
import { userRouter } from "./routes/user.routes.js"

dotenv.config({ path: "./.env" })

const app = express()
const port = process.env.PORT

connectDB()

app.use(cors({
    origin: process.env.FRONT_URL,
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', indexRouter)
app.use('/user', userRouter)

app.listen(port, () => {
    console.log('Express is running')
})