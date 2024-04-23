import Room from '../models/Room.js'

const getUsersInRoomController = async (req, res) => {
    try {
        const roomId = req.params.roomId
        const loggedInUser = req.user

        const room = await Room.findOne({ name: roomId })

        res.render('room', { layout: 'layouts/chatLayout', room, loggedInUser })
    } catch (e) {
        console.error('Error fetching users in room:', e)
    }
}

export default getUsersInRoomController
