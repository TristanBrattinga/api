import 'dotenv/config'
import express from 'express'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import cors from 'cors'
import expressLayouts from 'express-ejs-layouts'
import cookieParser from 'cookie-parser'
import path from 'path'
import router from './src/router.js'

const app = express()
const port = process.env.PORT || 3000
const db = mongoose.connection
const admin = 'Admin'

import { fileURLToPath } from 'url'
import { dirname } from 'path'

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

const predefinedRooms = ['Room 1', 'Room 2', 'Room 3']

io.on('connection', (socket) => {
    // Upon connection -> only to user
    socket.emit('message', buildMsg(admin, 'Welcome to Chat App!'))

    socket.emit('predefinedRooms', predefinedRooms)

    socket.on('enterRoom', ({ name, room }) => {
        // Leave previous room
        const prevRoom = getUser(socket.id)?.room

        if (prevRoom) {
            socket.leave(prevRoom)
            io.to(prevRoom).emit(
                'message',
                buildMsg(admin, `${name} has left the room`)
            )
        }

        const user = activateUser(socket.id, name, room)

        // Cannot update previous room users list until after the state update in active user
        if (prevRoom) {
            io.to(
                prevRoom.emit('userList', {
                    users: getUsersInRoom(prevRoom)
                })
            )
        }

        // Join room
        socket.join(user.room)

        // To user who joins
        socket.emit(
            'message',
            buildMsg(admin, `You have joined the ${user.room} chat room`)
        )

        // To everyone else
        socket.broadcast
            .to(user.room)
            .emit(
                'message',
                buildMsg(admin, `${user.name} has joined the room`)
            )

        // Update user list for room
        io.to(user.room).emit('userList', {
            users: getUsersInRoom(user.room)
        })

        // Update room list for everyone
        io.emit('roomList', {
            rooms: getAllActiveRooms()
        })
    })

    // When user disconnects -> to all others
    // socket.on('disconnect', () => {
    //     const user = getUser(socket.id)
    //     userLeavesApp(socket.id)
    //
    //     if (user) {
    //         io.to(user.room).emit(
    //             'message',
    //             buildMsg(admin, `${user.name} has left the room`)
    //         )
    //
    //         io.to(user.room).emit('userList', {
    //             users: getUsersInRoom(user.room)
    //         })
    //
    //         io.emit('roomList', {
    //             rooms: getAllActiveRooms()
    //         })
    //     }
    //
    //     console.log(`User ${socket.id} disconnected`)
    // })

    // Listening for a message event
    // socket.on('message', ({ name, text }) => {
    //     const room = getUser(socket.id)?.room
    //     if (room) {
    //         io.to(room).emit('message', buildMsg(name, text))
    //     }
    // })

    // Lister for activity
    // socket.on('activity', (name) => {
    //     const room = getUser(socket.id)?.room
    //     if (room) {
    //         socket.broadcast.to(room).emit('activity', name)
    //     }
    // })
})

const buildMsg = (name, text) => {
    return {
        name,
        text,
        time: new Intl.DateTimeFormat('default', {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        }).format(new Date())
    }
}

// User functions
// const activateUser = (id, name, room) => {
//     const user = { id, name, room }
//     UsersState.setUsers([
//         ...UsersState.users.filter((user) => user.id !== id),
//         user
//     ])
//     return user
// }
//
// const userLeavesApp = (id) => {
//     UsersState.setUsers(UsersState.users.filter((user) => user.id !== id))
// }
//
// const getUser = (id) => {
//     return UsersState.users.find((user) => user.id === id)
// }
//
// const getUsersInRoom = (room) => {
//     return UsersState.users.filter((user) => user.room === room)
// }
//
// const getAllActiveRooms = () => {
//     return Array.from(new Set(UsersState.users.map((user) => user.room)))
// }

// Error route handling for non-existing pages
app.use((req, res) => {
    res.status(404).send(
        'We`re sorry, we were not able to find the page you were looking for'
    )
})
