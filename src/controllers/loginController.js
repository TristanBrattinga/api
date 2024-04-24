import User from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const loginUser = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.render('login', { error: 'User not found' })
        }
        if (!(await bcrypt.compare(password, user.password))) {
            return res.render('login', { error: 'Passwords do not match' })
        }

        // Generate access token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30s'
        })

        // Generate refresh token
        const refreshToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_REFRESH_SECRET,
            {
                expiresIn: '1d'
            }
        )

        res.cookie('token', token, { httpOnly: true })
        res.cookie('refreshToken', refreshToken, { httpOnly: true })

        res.redirect('/rooms')
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

export default loginUser
