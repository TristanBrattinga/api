const express = require('express')
const router = express.Router()

router.post('/', (req, res) => {
    res.clearCookie('token')
    res.clearCookie('refreshToken')
    res.redirect('/login')
})

module.exports = router
