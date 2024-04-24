import mongoose from 'mongoose'
const Schema = mongoose.Schema

const roomSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
})

const Room = mongoose.model('Room', roomSchema)

export default Room
