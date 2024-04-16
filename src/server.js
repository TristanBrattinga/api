require('dotenv').config();
const express = require('express')
const app   = express()
const path = require('path')
const mongoose = require('mongoose')
const cors = require('cors')
const db = mongoose.connection
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const expressLayouts = require('express-ejs-layouts')
const User = require('./models/user')
const port  = process.env.PORT || 3000

// Set the view engine to EJS
app.set('view engine', 'ejs')
app.set('layout', 'layouts/main')

// Define static file folder
app.use(express.static('public'))

// Middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())
app.use(expressLayouts)

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
app.get('/', (req, res) => {
    res.render('index')
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({ username, email, password: hashedPassword })
    console.log(user)
    try {
        await user.save()
        console.log('User registered successfully:', user)
        res.redirect('/login')
    } catch (err) {
        console.error('Error registering user:', err)
        res.status(500).send('Error registering user')
    }
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
        return res.render('login', {error: 'User not found'})
    } else if (user) {
        console.log(user)
    }
    if (!await bcrypt.compare(password, user.password)) {
        return res.render('login', {error: 'Passwords do not match'})
    }
    // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)
    // res.cookie('token', token, { httpOnly: true })
    res.redirect('/profile')
})

// const authenticateJWT = (req, res, next) => {
//     const token = req.cookies.token
//     if (!token) {
//         return res.redirect('/login')
//     }
//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//         if (err) {
//             return res.redirect('/login')
//         }
//         req.user = user
//         next()
//     })
// }

app.get('/profile', (req, res) => {
    res.render('profile')
})


// Error route handling for non-existing pages
app.use((req, res) => {
    res.status(404).send('We`re sorry, we were not able to find the page you were looking for')
})

// Check if DB is connected and then listen to port
db.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(port, () => {
        console.log(`Server running on port: ${port}`)
        // console.log("\x1b]8;;http://localhost:3000\x1b\\Click here to open localhost:3000 in your browser\x1b]8;;\x1b\\");
    })
})