const passport = require('passport')
const mongoose = require('mongoose')
const User = mongoose.model('User')

exports.loginForm = (req, res) => {
  res.render('login', { title: 'Login'})
}

exports.registerForm = (req, res) => {
  res.render('register', { title: 'Register'})
}

exports.validateRegister = (req, res, next) => {
  req.sanitizeBody('name')
  req.checkBody('name', 'You must supply a name!').notEmpty()
  req.checkBody('email', 'That Email is not valid!').isEmail()
  req.sanitizeBody('email').normalizeEmail({
    gmail_remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  })
  req.checkBody('password', 'Password Cannot be Blank!').notEmpty()

  const errors = req.validationErrors()
  if (errors) return res.render('register', { title: 'Register', body: req.body })

  next()
}

exports.register = (req, res, next) => {
  passport.authenticate('register', (err, user, info) => {
    if (err) console.error(err)
    if (info) return res.status(403).send(info.message)

    req.login(
      user,
      async error => {
        if (err) return res.send(err)

        const user = await User.findOne({ email: req.body.email })

        if (!user) return res.status(403).send({ message: 'no user' })
      }
    )
  })(req, res)

  next()
}
