import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: [true, 'username already taken'],
        lowercase: true,
        trim: true,
        minLength: 8,
    },
    email: {
        type: String,
        required: true,
        unique: [true, 'email is already registered'],
        lowercase: true,
        trim: true,
        minLength: 8
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 8
    },
}, {
    timestamps: true
})


const userModel = mongoose.model('User', userSchema)
export default userModel