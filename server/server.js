import express from 'express'
const app   = express()
const port  = process.env.PORT || 3000

app.use(express.static('public'))
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
    res.render('index')
})

app.listen(port, () => {
    console.log(`listening on port: ${port}`)
})

