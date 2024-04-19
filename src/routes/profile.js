import express from 'express'
const router = express.Router()
import authenticate from '../middleware/authenticate.js'

router.get('/', authenticate, (req, res) => {
    const user = req.user
    res.render('profile', { user })
})

export default router
