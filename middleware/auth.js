import JWT from "jsonwebtoken"

export default function auth(req, res, next) {
    const token = req.cookies.token
    if (!token) return res.status(401).json({ message: "Invalid session, please login or sign up" })

    try {
        const verifiedToken = JWT.verify(token, process.env.JWT_SECRET)
        req.user = verifiedToken
        return next()
    } catch (error) {
        res.status(401).json({ message: "unauthorized" })
    }
}