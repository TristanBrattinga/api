import mongoose from 'mongoose'
const Schema = mongoose.Schema

const roomSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    users: {
        type: Array
    },
    slug: {
        type: String,
        required: true
    }
})

const Room = mongoose.model('Room', roomSchema)

export default Room
