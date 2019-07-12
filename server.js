require('dotenv').config()
const mongoose = require('mongoose')
const port = process.env.PORT || 7777
const db = process.env.DATABASE

mongoose.connect(db, { useNewUrlParser: true})
mongoose.Promise = global.Promise
mongoose.set('useCreateIndex', true)
mongoose.connection.on('error', error => {
  console.error(`🙅 🚫 🙅 🚫 🙅 → ${error.message}`)
})

require('./models/User')

const app = require('./app')
app.set('port', port)

const server = app.listen(app.get('port'), () => {
  console.log(`Express running on port ${server.address().port}`)
})
