import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import expressLayouts from 'express-ejs-layouts'
import cookieParser from 'cookie-parser'
import path from 'path'
const app = express()
const port = process.env.PORT || 3000
const db = mongoose.connection

import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Set the view engine to EJS
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Define the layouts folder
app.set('layout', 'layouts/main')

// Import routers
import indexRouter from './routes/index.js'
import registerRouter from './routes/register.js'
import loginRouter from './routes/login.js'
import profileRouter from './routes/profile.js'
import logoutRouter from './routes/logout.js'
import deleteRouter from './routes/delete.js'

// Define static file folder
app.use(express.static(path.join(__dirname, 'public')))

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
app.use('/logout', logoutRouter)
app.use('/delete', deleteRouter)

// Error route handling for non-existing pages
app.use((req, res) => {
    res.status(404).send(
        'We`re sorry, we were not able to find the page you were looking for'
    )
})

// Check if DB is connected and then listen to port
db.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(port, () => {
        console.log(`Server running on port: ${port}`)
    })
})
