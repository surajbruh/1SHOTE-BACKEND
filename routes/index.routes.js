import express from "express"
import productModel from "../models/product.js"
import auth from "../middleware/auth.js"
import cartItemModel from "../models/cartItem.js"

export const indexRouter = express.Router()

indexRouter.get('/', auth, async (req, res) => {
    const cartItem = await cartItemModel.find({ userId: req.user.id })
    console.log(cartItem)
    try {
        const items = await productModel.find()
        if (!items) return res.status(200).json({ message: 'empty' })
        res.status(200).json({ items, cartItem })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

indexRouter.post('/item', async (req, res) => {
    const { category, name, price } = req.body
    console.log(req.body)
    res.json({ message: 'post req' })

})