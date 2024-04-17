const jwt = require('jsonwebtoken')
const User = require('../models/user')

const authenticate = async (req, res, next) => {
    try {
        const accessToken = req.cookies.token
        const refreshToken = req.cookies.refreshToken

        if (!accessToken || !refreshToken) {
            return res.redirect('/login')
        }

        // Verify the access token
        jwt.verify(
            accessToken,
            process.env.JWT_SECRET,
            async (accessTokenErr, decoded) => {
                if (accessTokenErr) {
                    // Access token expired, try to refresh it
                    jwt.verify(
                        refreshToken,
                        process.env.JWT_REFRESH_SECRET,
                        async (refreshTokenErr, decodedRefresh) => {
                            if (refreshTokenErr) {
                                // Both tokens are invalid, redirect to log in
                                return res.redirect('/login')
                            } else {
                                // Refresh token is valid, issue a new access token
                                const newAccessToken = jwt.sign(
                                    { userId: decodedRefresh.userId },
                                    process.env.JWT_SECRET,
                                    { expiresIn: '30s' }
                                )

                                // Set the new access token in the request
                                req.accessToken = newAccessToken

                                // Fetch the user based on userId
                                const user = await User.findById(
                                    decodedRefresh.userId
                                )
                                if (!user) {
                                    throw new Error('User not found')
                                }
                                // Attach the user object to the request
                                req.user = user

                                next()
                            }
                        }
                    )
                } else {
                    // Access token is valid, continue with the request
                    req.userId = decoded.userId

                    // Fetch the user based on userId
                    const user = await User.findById(decoded.userId)
                    if (!user) {
                        throw new Error('User not found')
                    }
                    // Attach the user object to the request
                    req.user = user

                    next()
                }
            }
        )
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

module.exports = authenticate
