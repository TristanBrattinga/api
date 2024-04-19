import mongoose from 'mongoose'
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    users: {
        type: String,
        required: true
    }
})

const Room = mongoose.model('Room', userSchema)

export default Room
