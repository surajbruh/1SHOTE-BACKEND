import express from "express"
import productModel from "../models/product.js"
import auth from "../middleware/auth.js"
import cartItemModel from "../models/cartItem.js"
import wishlistItemModel from "../models/wishlistItem.js"

export const indexRouter = express.Router()

indexRouter.get('/', auth, async (req, res) => {
    const cartItem = await cartItemModel.find({ userId: req.user.id })
    const wishlistedItems = await wishlistItemModel.find({ userId: req.user.id })
    // console.log(wishlistedItems)
    try {
        const items = await productModel.find()
        if (!items) return res.status(200).json({ message: 'empty' })
        res.status(200).json({ items, cartItem, wishlistedItems })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

indexRouter.post('/item', async (req, res) => {
    const { category, name, price } = req.body
    console.log(req.body)
    res.json({ message: 'post req' })

})

indexRouter.get('/verify', auth, (req, res) => {
    const { id } = req.user
    console.log(id)
    if (!id) return res.status(401).json({
        status: false,
        message: 'Unauthorized'
    })
    res.status(200).json({ message: 'Authorized user' })
})