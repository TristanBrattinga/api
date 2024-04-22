// eslint-disable-next-line no-undef
const socket = io('ws://localhost:3000')

const roomList = document.getElementById('roomList')

socket.on('predefinedRooms', (predefinedRooms) => {
    roomList.textContent = ''

    predefinedRooms.forEach((room) => {
        const li = document.createElement('li')
        const button = document.createElement('button')
        button.textContent = room
        button.value = room
        button.addEventListener('click', () => {
            socket.emit('enterRoom', room)
        })
        li.appendChild(button)
        roomList.appendChild(li)
    })
})

const foldSidebarButton = document.getElementById('foldSidebar')
const sidebar = document.querySelector('.sidebar')

foldSidebarButton.addEventListener('click', () => {
    foldSidebarButton.classList.toggle('fold')
    sidebar.classList.toggle('fold')
})
