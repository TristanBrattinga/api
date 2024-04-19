import express from 'express'
const router = express.Router()
import loginController from '../controllers/loginController.js'

router.get('/', (req, res) => {
    res.render('login')
})

router.post('/', loginController)

export default router
