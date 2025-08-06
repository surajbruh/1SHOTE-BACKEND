import express from "express"
import userModel from "../models/user.js"
import cartItemModel from "../models/cartItem.js"
import { validationResult } from "express-validator"
import bcrypt from "bcrypt"
import JWT from "jsonwebtoken"
import auth from "../middleware/auth.js"
import wishlistItemModel from "../models/wishlistItem.js"
import { signupValidator, loginValidator } from "../validators/userValidators.js"

export const userRouter = express.Router()

//user
userRouter.get('/', auth, async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.user.id }, "email username")
        if (!user) return res.status(401).json({ message: 'unauthorized' })

        const { username, email } = user
        res.status(200).json({
            username, email
        })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

userRouter.post('/signup',
    signupValidator,
    async (req, res) => {
        const { username, email, password } = req.body

        const result = validationResult(req)
        if (!result.isEmpty()) return res.status(400).json({ message: result.array()[0].msg, error: result.array()[0].path })

        try {
            //checks if user already exists or not
            const existingUser = await userModel.findOne({ $and: [{ username }, { email }] })
            if (existingUser) return res.status(409).json({ message: 'user already exists' })

            const hashedPassword = await bcrypt.hash(password, 10)
            const newUser = await userModel.create({
                username,
                email,
                password: hashedPassword
            })

            res.status(201).json({
                message: 'user registered successfully',
                status: true,
                user: {
                    id: newUser._id,
                    username: newUser.username
                }
            })
        } catch (error) {
            res.status(400).json({ message: error.message })

        }
    })

userRouter.post('/login',
    loginValidator,
    async (req, res) => {
        const { username, password } = req.body

        const result = validationResult(req)
        if (!result.isEmpty()) return res.status(400).json({ message: result.array()[0].msg, error: result.array()[0].path })

        try {
            //verifies user
            const user = await userModel.findOne({ username })
            if (!user) return res.status(401).json({ message: "username or password is incorrect" })

            //verifies password 
            const match = await bcrypt.compare(password, user.password)
            if (!match) return res.status(401).json({ message: "username or password is incorrect" })

            const token = JWT.sign({
                id: user._id,
                username: user.username
            }, process.env.JWT_SECRET, { expiresIn: "30m" })

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 30 * 60 * 1000 //30 minutes

            })

            res.status(200).json({
                message: `welcome back ${user.username}`,
                status: true,
                user: { id: user._id, username: user.username, token: token }
            })
        } catch (error) {
            res.status(400).json({ error: error.message })

        }
    })

userRouter.get('/logout', auth, (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
    });
    res.json({ message: 'user logged out' });
})

//cart
userRouter.get('/cart', auth, async (req, res) => {
    try {
        const cartItems = await cartItemModel.find({ userId: req.user.id })
        // console.log(cartItems)
        if (!cartItems) return res.status(200).json({ message: "cart is empty" })
        res.status(200).json(cartItems)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

userRouter.post('/cart', auth, async (req, res) => {
    const { itemCategory, itemId, itemName, itemPrice, itemImage } = req.body
    try {
        //checks if the item is already added to cart by the user
        const AlreadyAddedItem = await cartItemModel.findOne({ userId: req.user.id, itemId })
        if (AlreadyAddedItem) return res.status(200).json({ message: 'Item already added to cart' })

        const newCartItem = await cartItemModel.create({
            userId: req.user.id,
            itemId,
            itemName,
            itemCategory,
            itemPrice,
            itemImageUrl: itemImage
        })
        res.status(201).json({
            message: "item added to cart",
            item: newCartItem
        })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

userRouter.delete('/cart/:itemId', auth, async (req, res) => {
    const { itemId } = req.params

    try {
        const deletedItem = await cartItemModel.findOneAndDelete({ itemId, userId: req.user.id })
        if (!deletedItem) return res.status(409).json({ message: "Item not found" })
        res.status(200).json({
            message: 'Item removed from cart',
            removedItem: deletedItem
        })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

//wishlist
userRouter.get('/wishlist', auth, async (req, res) => {
    try {
        const wishlistItem = await wishlistItemModel.find({ userId: req.user.id })

        if (!wishlistItem) return res.status(200).json({ message: "wishlist is empty" })
        res.status(200).json(wishlistItem)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

userRouter.post('/wishlist', auth, async (req, res) => {
    const { itemCategory, itemId, itemName, itemPrice, itemImage } = req.body
    try {
        //checks if the item is already added to wishlist by the user
        const AlreadyAddedItem = await wishlistItemModel.findOne({ userId: req.user.id, itemId })
        if (AlreadyAddedItem) return res.status(200).json({ message: 'Item already added to wishlist' })

        const newWishlistItem = await wishlistItemModel.create({
            userId: req.user.id,
            itemId,
            itemName,
            itemCategory,
            itemPrice,
            itemImageUrl: itemImage
        })
        res.status(201).json({
            message: "Item added to wishlist",
            item: newWishlistItem
        })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

userRouter.delete('/wishlist/:itemId', auth, async (req, res) => {
    const { itemId } = req.params

    try {
        const deletedItem = await wishlistItemModel.findOneAndDelete({ itemId, userId: req.user.id })
        if (!deletedItem) return res.status(409).json({ message: "Item not found" })
        res.status(200).json({
            message: 'Item removed from wishlist',
            removedItem: deletedItem
        })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})