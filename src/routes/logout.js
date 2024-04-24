import express from 'express'
const router = express.Router()

router.post('/', (req, res) => {
    res.clearCookie('token')
    res.clearCookie('refreshToken')
    res.redirect('/')
})

export default router
