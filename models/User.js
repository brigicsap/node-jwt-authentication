const mongoose = require('mongoose')
const Schema = mongoose.Schema
const validator = require('validator')
mongoose.Promise = global.Promise
const mongodbErrorHandler = require('mongoose-mongodb-errors')

const userSchema = new Schema({
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Invalid email address'],
    required: 'Please enter your email address'
  },
  password: {
    type: String,
    required: 'Please enter a password'
  }
})

userSchema.plugin(mongodbErrorHandler)

module.exports = mongoose.model('User', userSchema)
