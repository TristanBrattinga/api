require('dotenv').config();
const express = require('express')
const app   = express()
const mongoose = require('mongoose')
const cors = require('cors')
const db = mongoose.connection
const port  = process.env.PORT || 3000

app.use(express.static('public'))

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

app.set('view engine', 'ejs')

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
    } catch (e) {
        console.error(e)
    }
}

connectDB()

// Routes
app.use('/', require('./routes/index'))

// Error route handling for non-existing pages
app.use((req, res) => {
    res.status(404).send('We`re sorry, we were not able to find the page you were looking for')
})

db.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(port, () => {
        console.log(`Server running on port: ${port}`)
    })
})