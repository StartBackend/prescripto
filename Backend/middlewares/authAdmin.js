import jwt from 'jsonwebtoken'

const authAdmin = async (req, res, next) => {
    try {
        const { atoken } = req.headers

        if (!atoken) {
            return res.json({ success: false, message: "Not Authorized login again" })
        }

        const token_decode = jwt.verify(atoken, process.env.JWT_SECRET)

        // ✅ Fix 1 - compare email field not whole object
        if (token_decode.email !== process.env.ADMIN_EMAIL) {
            return res.json({ success: false, message: 'Not Authorized login again' })
        }

        next()

    } catch (error) {
        // ✅ Fix 2 & 3 - correct spelling
        res.json({ success: false, message: error.message })
    }
}

export default authAdmin