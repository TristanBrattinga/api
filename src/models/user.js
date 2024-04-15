const
    mongoose = require('mongoose'),
    Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
})

const User = mongoose.model('User', userSchema)

module.exports = User
