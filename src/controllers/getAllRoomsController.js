import Room from '../models/Room.js'

const getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find()
        console.log(rooms)
        res.render('rooms', { rooms })
    } catch (e) {
        console.error(e)
        return []
    }
}

export default getAllRooms
