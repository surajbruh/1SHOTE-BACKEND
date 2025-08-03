import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        minLength: 8,
        timestamps: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        minLength: 8
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 8
    }
})


const userModel = mongoose.model('User', userSchema)
export default userModel