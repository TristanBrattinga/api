import express from 'express'
const router = express.Router()
import deleteController from '../controllers/deleteController.js'
import authenticate from '../middleware/authenticate.js'

router.post('/', authenticate, deleteController)

export default router
