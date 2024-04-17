const bcrypt = require('bcrypt')
const User = require('../models/user')

const registerUser = async (req, res) => {
    const { username, email, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({ username, email, password: hashedPassword })
    try {
        await user.save()
        console.log('User registered successfully:', user)
        res.redirect('/login')
    } catch (err) {
        console.error('Error registering user:', err)
        res.status(500).send('Error registering user')
    }
}

module.exports = registerUser