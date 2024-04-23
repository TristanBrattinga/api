import express from 'express'
import authenticate from './middleware/authenticate.js'
import loginController from './controllers/loginController.js'
import registerController from './controllers/registerController.js'
import deleteController from './controllers/deleteController.js'
import getAllRoomsController from './controllers/getAllRoomsController.js'
import getUsersInRoomController from './controllers/getUsersInRoomController.js'

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
    .get('/profile/:userId', authenticate, (req, res) => {
        const user = req.user
        res.render('profile', { user })
    })
    .post('/delete', authenticate, deleteController)
    .get('/rooms', authenticate, getAllRoomsController)
    .get('/rooms/:roomId', authenticate, getUsersInRoomController)

export default router
