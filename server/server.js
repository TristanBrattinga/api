import express from 'express'
import { Server } from 'socket.io'

const app   = express()
const port  = process.env.PORT || 3500
const admin = 'Admin'

app.use(express.static('public'))

const expressServer = app.listen(port, () => {
    console.log(`listening on port: ${port}`)
})

// State
const UsersState = {
    users:    [],
    setUsers: function(newUsersArray) {
        this.users = newUsersArray
    },
}

const io = new Server(expressServer, {
    cors: {
        origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:63342'],
    },
})

io.on('connection', socket => {

    // Upon connection -> only to user
    socket.emit('message', buildMsg(admin, 'Welcome to Chat App!'))

    socket.on('enterRoom', ({ name, room }) => {
        // Leave previous room
        const prevRoom = getUser(socket.id)?.room

        if (prevRoom) {
            socket.leave(prevRoom)
            io.to(prevRoom).emit('message', buildMsg(admin, `${name} has left the room`))
        }

        const user = activateUser(socket.id, name, room)

        // Cannot update previous room users list until after the state update in active user
        if (prevRoom) {
            io.to(prevRoom.emit('userList', {
                users: getUsersInRoom(prevRoom),
            }))
        }

        // Join room
        socket.join(user.room)

        // To user who joins
        socket.emit('message', buildMsg(admin, `You have joined the ${user.room} chat room`))

        // To everyone else
        socket.broadcast.to(user.room).emit('message', buildMsg(admin, `${user.name} has joined the room`))

        // Update user list for room
        io.to(user.room).emit('userList', {
            users: getUsersInRoom(user.room),
        })

        // Update room list for everyone
        io.emit('roomList', {
            rooms: getAllActiveRooms(),
        })
    })

    // When user disconnects -> to all others
    socket.on('disconnect', () => {
        const user = getUser(socket.id)
        userLeavesApp(socket.id)

        if (user) {
            io.to(user.room).emit('message', buildMsg(admin, `${user.name} has left the room`))

            io.to(user.room).emit('userList', {
                users: getUsersInRoom(user.room),
            })

            io.emit('roomList', {
                rooms: getAllActiveRooms(),
            })
        }

        console.log(`User ${socket.id} disconnected`)
    })

    // Listening for a message event
    socket.on('message', ({ name, text }) => {
        const room = getUser(socket.id)?.room
        if (room) {
            io.to(room).emit('message', buildMsg(name, text))
        }
    })

    // Lister for activity
    socket.on('activity', (name) => {
        const room = getUser(socket.id)?.room
        if (room) {
            socket.broadcast.to(room).emit('activity', name)
        }
    })
})

const buildMsg = (name, text) => {
    return {
        name,
        text,
        time: new Intl.DateTimeFormat('default', {
            hour:   'numeric',
            minute: 'numeric',
            second: 'numeric',
        }).format(new Date()),
    }
}

// User functions
const activateUser = (id, name, room) => {
    const user = { id, name, room }
    UsersState.setUsers([
        ...UsersState.users.filter(user => user.id !== id),
        user,
    ])
    return user
}

const userLeavesApp = (id) => {
    UsersState.setUsers(
        UsersState.users.filter(user => user.id !== id),
    )
}

const getUser = (id) => {
    return UsersState.users.find(user => user.id === id)
}

const getUsersInRoom = (room) => {
    return UsersState.users.filter(user => user.room === room)
}

const getAllActiveRooms = () => {
    return Array.from(new Set(UsersState.users.map(user => user.room)))
}