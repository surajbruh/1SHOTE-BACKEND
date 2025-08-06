import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    category: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String,
        require: true,
        trim: true,
    }
})

const productModel = mongoose.model('Product', productSchema)
export default productModel