require('dotenv').config();
const express = require('express')
const app   = express()
const mongoose = require('mongoose')
const cors = require('cors')
const db = mongoose.connection
const expressLayouts = require('express-ejs-layouts')
const cookieParser = require('cookie-parser')
const port  = process.env.PORT || 3000

// Set the view engine to EJS
app.set('view engine', 'ejs')

// Define the layouts folder
app.set('layout', 'layouts/main')

// Import routers
const indexRouter = require('./routes/index')
const registerRouter = require('./routes/register')
const loginRouter = require('./routes/login')
const profileRouter = require('./routes/profile')

// Define static file folder
app.use(express.static('public'))

// Middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())
app.use(expressLayouts)
app.use(cookieParser())

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
app.use('/', indexRouter)
app.use('/register', registerRouter)
app.use('/login', loginRouter)
app.use('/profile', profileRouter)



// Error route handling for non-existing pages
app.use((req, res) => {
    res.status(404).send('We`re sorry, we were not able to find the page you were looking for')
})

// Check if DB is connected and then listen to port
db.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(port, () => {
        console.log(`Server running on port: ${port}`)
    })
})