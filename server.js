import 'dotenv/config'
import express from 'express'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import cors from 'cors'
import expressLayouts from 'express-ejs-layouts'
import cookieParser from 'cookie-parser'
import multer from 'multer'
import router from './src/router.js'
import buildMsg from './src/utils/buildMessage.js'

const app = express()
const port = process.env.PORT || 3000
const db = mongoose.connection
const admin = 'Admin'
import path from 'node:path'
const __dirname = import.meta.dirname
import User from './src/models/User.js'
import authenticate from './src/middleware/authenticate.js'

// Set the view engine to EJS
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'src', 'views'))

// Define the layouts folder
app.set('layout', 'layouts/main')

// Define static file folder
app.use(express.static(path.join(__dirname, 'src', 'public')))

// Middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())
app.use(expressLayouts)
app.use(cookieParser())
app.use(router)

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
    } catch (e) {
        console.error(e)
    }
}

connectDB()

// Set up storage using multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/uploads/avatars')
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + '-' + Date.now() + path.extname(file.originalname)
        )
    }
})

// Initiate multer upload
const upload = multer({ storage: storage })

// Handle POST request for avatar upload
app.post('/upload', authenticate, upload.single('avatar'), async (req, res) => {
    try {
        const userId = req.user._id

        const avatarPath = req.file.path

        await User.findByIdAndUpdate(userId, { avatar: avatarPath })

        res.redirect('/profile/:userId')
    } catch (err) {
        console.error(err)
        res.status(500).send('Internal Server Error')
    }
})

const expressServer = app.listen(port, () => {
    console.log(`listening on port: ${port}`)
})

// Check if DB is connected and then listen to port
db.once('open', () => {
    console.log('Connected to MongoDB')
})

const io = new Server(expressServer, {
    cors: {
        origin:
            process.env.NODE_ENV === 'production'
                ? false
                : ['http://localhost:63342']
    }
})

io.on('connection', (socket) => {
    console.log('New connection:', socket.id)

    // Upon connection -> only to user
    socket.emit('message', buildMsg(admin, 'Welcome to Chat App!'))

    socket.on('joinRoom', (roomId) => {
        socket.join(roomId)
        console.log(`Socket ${socket.id} joined room ${roomId}`)
    })

    socket.on('message', ({ name, text }) => {
        if (room) {
            io.to(room).emit('message', buildMsg(name, text))
        }
    })
})

// Error route handling for non-existing pages
app.use((req, res) => {
    res.status(404).send(
        'We`re sorry, we were not able to find the page you were looking for'
    )
})
