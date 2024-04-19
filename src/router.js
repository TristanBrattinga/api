import express from 'express'
import authenticate from './middleware/authenticate.js'
import loginController from './controllers/loginController.js'
import registerController from './controllers/registerController.js'
import deleteController from './controllers/deleteController.js'

const router = express.Router()

router
    .get('/login', (req, res) => {
        res.render('login')
    })
    .post('/login', loginController)
    .get('/register', (req, res) => {
        res.render('register')
    })

    .post('/register', registerController)
    .get('/', (req, res) => {
        res.render('index')
    })
    .post('/logout', (req, res) => {
        res.clearCookie('token')
        res.clearCookie('refreshToken')
        res.redirect('/login')
    })
    .get('/profile', authenticate, (req, res) => {
        const user = req.user
        res.render('profile', { user })
    })
    .post('/delete', authenticate, deleteController)
    .get('/rooms', authenticate, (req, res) => {
        res.render('rooms')
    })
    .get('/rooms/:roomId', authenticate, (req, res) => {
        res.render('room', { layout: 'layouts/chatLayout' })
    })

export default router
