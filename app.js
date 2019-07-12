const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
//@TODO upgrade package
const expressValidator = require('express-validator')
const passport = require('passport')
const routes = require('./routes/index')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

//passport setup
require('./handlers/passport')(passport)
app.use(passport.initialize())

app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(expressValidator())

app.use('/', routes)

module.exports = app
