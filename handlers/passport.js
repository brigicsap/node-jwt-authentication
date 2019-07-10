const passport = require('passport')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const bcrypt = require('bcryptjs')

const secret = process.env.JWT_SECRET
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const LocalStrategy = require('passport-local').Strategy

module.exports = passport => {
  passport.use(
  'register',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
      session: false,
    },
    async (req, email, password, done) => {
      //check if user email already exists
      const user = await User.findOne({ email: req.body.email })
      //if email already taken, return error
      if (user) return done(null, false, { message: 'ooops email taken '})
      //encrypt password before saving to db
      const hash = await bcrypt.hash(password, 10, (err, res) => {
        console.log({err, res})
      })
      //save user in db
      User
        .create({
          name: req.body.name,
          username: req.body.email,
          email: req.body.email,
          password: hash,
        })
        .then(user => {
          return done(null, user)
        })
        .catch(err => {
          return done(err, false)
        })
    }
  ))

  passport.use(
    'login',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        session: false
      },
      async (email, password, done) => {
        //find user by email address
        const user = await User.findOne({ email })
        //return error if user not found
        if (!user) return done(null, false, { message: 'incorrect username' })
        //check if passwords are valid
        const pwdValid = await bcrypt.compare(password, user.password)
        //return error is password not valid
        if (!pwdValid) return done(null, false, { message: 'passwords do not match' })
        //return user if everything matches
        return done(null, user)
      }
    )
  )

  passport.use(
    'jwt',
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: secret
      },
      async (payload, done) => {
        const user = await User.findOne({ where: { id: payload.id}})

        if (!user) return done(null, false, { message: 'ooops sth wrong' })

        return done(null, user)
    })
  )
}
