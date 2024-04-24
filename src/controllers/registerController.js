import bcrypt from 'bcrypt'
import User from '../models/User.js'

const registerUser = async (req, res) => {
    const { username, email, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({ username, email, password: hashedPassword })
    try {
        await user.save()
        console.log('User registered successfully:', user)
        res.redirect('/')
    } catch (err) {
        console.error('Error registering user:', err)
        res.status(500).send('Error registering user')
    }
}

export default registerUser
