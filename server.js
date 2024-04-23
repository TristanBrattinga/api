import 'dotenv/config'
import express from 'express'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import cors from 'cors'
import expressLayouts from 'express-ejs-layouts'
import cookieParser from 'cookie-parser'
import path from 'path'
import router from './src/router.js'
import buildMsg from './src/utils/buildMessage.js'

const app = express()
const port = process.env.PORT || 3000
const db = mongoose.connection
const admin = 'Admin'

import { fileURLToPath } from 'url'
import { dirname } from 'path'
import Room from './src/models/Room.js'
import logout from './src/routes/logout.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

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
