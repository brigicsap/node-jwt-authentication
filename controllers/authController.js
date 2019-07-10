const passport = require('passport')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

exports.login = (req, res, next) => {
  passport.authenticate('login', (err, user, info) => {
    if (err) console.error(err)
    if (info) return res.status(403).send(info.message)

    req.login(
      user,
      { session: false },
      error => console.log({error})
    )

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)

    res
      .cookie('app_token', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 1 day
      })
      .status(200)
      .json({user, token})
  })(req, res)
}
