import User from '../models/User.js'

const deleteUser = async (req, res) => {
    try {
        const userId = req.user._id

        await User.findByIdAndDelete(userId)

        console.log('Deleted user: ', userId)

        res.redirect('/register')
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

export default deleteUser
