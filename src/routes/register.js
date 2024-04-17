import express from 'express'
const router = express.Router()
import registerController from '../controllers/registerController.js'

router.get('/', (req, res) => {
    res.render('register')
})

router.post('/', registerController)

export default router
