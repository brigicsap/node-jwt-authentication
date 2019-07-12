require('dotenv').config()
const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Welcome' })
})

router.get('/login', userController.loginForm)
router.get('/register', userController.registerForm)

router.post('/register',
  userController.validateRegister,
  userController.register
)

router.post('/login', authController.login)

module.exports = router
