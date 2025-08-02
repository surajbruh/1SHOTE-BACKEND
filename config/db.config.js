import mongoose from "mongoose";

export default function connectDB() {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('mongoDB connected'))
        .catch(err => console.error('mongoDB error', err.message))
}
