const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const loginUser = async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
        return res.render('login', {error: 'User not found'})
    } else if (user) {
        console.log(user)
    }
    if (!await bcrypt.compare(password, user.password)) {
        return res.render('login', {error: 'Passwords do not match'})
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30s' })
    res.cookie('token', token, { httpOnly: true })
    res.redirect('/profile')
}

module.exports = loginUser