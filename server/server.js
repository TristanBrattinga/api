import express from 'express'
import { Server } from 'socket.io'

const app = express()
const port = process.env.PORT || 3500
const admin = "Admin"

app.use(express.static('public'))

const expressServer = app.listen(port, () => {
    console.log(`listening on port: ${port}`)
})

// State
const UsersState = {
    users: [],
    setUsers: function (newUsersArray) {
        this.users = newUsersArray
    }
}

const io = new Server(expressServer, {
    cors: {
        origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:63342'],
    },
})

io.on('connection', socket => {
    console.log(`User ${socket.id} connected`)

    // Upon connection -> only to user
    socket.emit('message', buildMsg(admin, "Welcome to Chat App!"))

    // Upon connection -> to all others
    socket.broadcast.emit('message', `User ${socket.id.substring(0, 5)} connected`)

    // Listening for a message event
    socket.on('message', data => {
        console.log(data)
        io.emit('message', `${socket.id.substring(0, 5)}: ${data}`)
    })

    // When user disconnects -> to all others
    socket.on('disconnect', () => {
        socket.broadcast.emit('message', `User ${socket.id.substring(0, 5)} disconnected`)
    })

    // Lister for activity
    socket.on('activity', (name) => {
        socket.broadcast.emit('activity', name)
    })
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
const activateUser = (id, name, room) => {
    const user = { id, name, room }
    UsersState.setUsers([
        ...UsersState.users.filter(user => user.id !== id),
        user
    ])
    return user
}

const userLeavesApp = (id) => {
    UsersState.setUsers(
        UsersState.users.filter(user => user.id !== id)
    )
}

const getUser = (id) => {
    return UsersState.users.find(user => user.id === id)
}

const getUsersInRoom = (room) => {
    return UsersState.users.filter(user => user.room === room )
}

const getAllActiveRooms = () => {
    return Array.from(new Set(UsersState.users.map(user => user.room)))
}