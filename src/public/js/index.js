// eslint-disable-next-line no-undef
const socket = io('ws://localhost:3000')

// const messageInput = document.querySelector('#message-input')

const joinRoom = (roomId) => {
    if (roomId) {
        socket.emit('joinRoom', roomId)
        window.location.href = `/rooms/${roomId}`
    }
}

// const sendMessage = (e) => {
//     e.preventDefault()
//     socket.emit('message', {
//         name: '',
//         text: messageInput.value
//     })
//
//     messageInput.focus()
// }
//
// document.querySelector('.chatUI').addEventListener('submit', sendMessage)

document.querySelectorAll('.room-link').forEach((link) => {
    link.addEventListener('click', () => {
        console.log(link.id)
        joinRoom(link.id)
    })
})
