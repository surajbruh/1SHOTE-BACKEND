import mongoose from "mongoose";

const cartItemSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
        trim: true
    },
    itemId: {
        type: String,
        required: true,
        trim: true
    },
    itemName: {
        type: String,
        required: true,
        trim: true,
    },
    itemCategory: {
        type: String,
        required: true,
        trim: true,
    },
    itemPrice: {
        type: Number,
        required: true,
        trim: true,
    },
    itemImageUrl: {
        type: String,
        required: true,
        trim: true,
    }
})

const cartItemModel = mongoose.model("CartItem", cartItemSchema)
export default cartItemModel
