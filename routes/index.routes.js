import express from "express"
import productModel from "../models/product.js"

export const indexRouter = express.Router()

indexRouter.get('/', async (req, res) => {
    try {
        const items = await productModel.find()
        if (!items) return res.status(200).json({ message: 'empty' })
        res.status(200).json(items)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

indexRouter.post('/item', async (req, res) => {
    const { category, name, price } = req.body
    console.log(req.body)
    res.json({ message: 'post req' })

})

indexRouter.post('/cart', (req, res) => {
    console.log(req.body)
    res.json(req.body)
})