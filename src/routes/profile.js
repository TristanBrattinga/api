const express = require('express')
const router = express.Router()
const authenticate = require('../middleware/authenticate')

router.get('/', authenticate, (req, res) => {
    const user = req.user
    res.render('profile', { user })
})

module.exports = router