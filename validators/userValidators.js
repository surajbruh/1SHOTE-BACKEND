import { body } from "express-validator"

export const signupValidator = [
    body('username').notEmpty().withMessage('username is empty').trim().isLength({ min: 8 }).withMessage('username: minimum length is 8 characters'),
    body('email').notEmpty().withMessage('email is empty').trim().isLength({ min: 8 }).withMessage('email: minimum length is 8 characters').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('password is empty').trim().isLength({ min: 8 }).withMessage('password: minimum length is 8 characters'),
]

export const loginValidator = [
    body("username").notEmpty().withMessage('username is empty').trim().isLength({ min: 8 }).withMessage('username: minimum length is 8 characters'),
    body("password").notEmpty().withMessage('password is empty').trim().isLength({ min: 8 }).withMessage('password: minimum length is 8 characters'),
]