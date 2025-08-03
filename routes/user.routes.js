import express from "express"
import userModel from "../models/user.js"
import cartItemModel from "../models/cartItem.js"
import { body, validationResult } from "express-validator"
import bcrypt from "bcrypt"
import JWT from "jsonwebtoken"
import auth from "../middleware/auth.js"

export const userRouter = express.Router()

userRouter.post('/signup',
    body('username').notEmpty().trim().isLength({ min: 8 }),
    body('email').notEmpty().trim().isLength({ min: 8 }).isEmail(),
    body('password').notEmpty().trim().isLength({ min: 8 }),
    async (req, res) => {
        const { username, email, password } = req.body
        const result = validationResult(req)
        if (!result.isEmpty()) return res.status(400).json({ errors: result.array() })
        try {
            //checks if user already exists or not
            const existingUser = await userModel.findOne({ $or: [{ username }, { email }] })
            if (existingUser) return res.status(409).json({ message: 'user already exists' })

            const hashedPassword = await bcrypt.hash(password, 10)
            const newUser = await userModel.create({
                username,
                email,
                password: hashedPassword
            })

            res.status(201).json({
                message: 'user registered successfully',
                user: {
                    id: newUser._id,
                    username: newUser.username
                }
            })
        } catch (error) {
            res.status(400).json({ error: error.message })

        }
    })

userRouter.post('/login',
    body('username').notEmpty().trim().isLength({ min: 8 }),
    body('password').notEmpty().trim().isLength({ min: 8 }),
    async (req, res) => {
        const { username, password } = req.body
        const result = validationResult(req)
        if (!result.isEmpty()) return res.status(400).json({ errors: result.array() })

        try {
            //verifies user
            const user = await userModel.findOne({ username })
            if (!user) return res.status(401).json({ message: "username or password is incorrect" })

            //verifies password 
            const match = bcrypt.compare(password, user.password)
            if (!match) return res.status(401).json({ message: "username or password is incorrect" })

            const token = JWT.sign({
                id: user._id,
                username: user.username
            }, process.env.JWT_SECRET, { expiresIn: "30m" })

            res.cookie('token', token)

            res.status(200).json({
                message: `welcome back ${user.username}`,
                user: { id: user._id, username: user.username, token: token }
            })
        } catch (error) {
            res.status(400).json({ error: error.message })

        }
    })

userRouter.get('/cart', auth, async (req, res) => {
    try {
        const cartItems = await cartItemModel.find({ userId: req.user.id })
        console.log(cartItems)
        if (!cartItems) return res.status(200).json({ message: "cart is empty" })
        res.status(200).json(cartItems)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

userRouter.post('/cart', auth, async (req, res) => {
    const { itemCategory, itemId, itemName, itemPrice, itemImage } = req.body
    try {
        const newCartItem = await cartItemModel.create({
            userId: req.user.id,
            itemId,
            itemName,
            itemCategory,
            itemPrice,
            itemImageUrl: itemImage
        })
        res.status(201).json({ item: newCartItem })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

userRouter.delete('/cart', auth, (req, res) => {
    console.log(req.body);

    res.json({ message: 'del req' })
})