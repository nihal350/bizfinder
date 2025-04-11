require('dotenv').config()
const express = require('express')
const app = express()

app.set('view engine', 'ejs')

const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
app.use(cookieParser())
app.use(fileUpload({useTempFiles : true, tempFileDir:'/tmp/'}))
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(express.json())

const connectDB = require('./config/database')
const connectCloudinary = require('./config/cloudinary')

const adminRoute = require('./routes/adminRoute')
const businessRouter = require('./routes/businessRoute')
const userRoute = require('./routes/userRoute')


app.use('/admin', adminRoute)
app.use('/business', businessRouter)
app.use('/', userRoute)
app.use('*', (req, res) => {
    return res.render('user/error')
})

const port = process.env.port || 3000
app.listen(port, () => {
    console.log(`server started on port ${port}`)
    connectDB()
    connectCloudinary()
})