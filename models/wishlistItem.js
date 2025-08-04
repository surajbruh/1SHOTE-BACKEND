import mongoose from "mongoose";

const wishlistItemSchema = mongoose.Schema({
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

const wishlistItemModel = mongoose.model('WishlistItem', wishlistItemSchema)
export default wishlistItemModel