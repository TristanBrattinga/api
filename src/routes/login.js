const express = require('express')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const router = express.Router()
const loginController = require('../controllers/loginController')

router.get('/', (req, res) => {
    res.render('login')
})

router.post('/', loginController)

module.exports = router