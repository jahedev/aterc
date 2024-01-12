require("dotenv").config()

const passport = require("passport")
const jwt = require("jsonwebtoken")
const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt
const User = require("../db/models/user")

const { JWT_SECRET } = process.env

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
}

const getJwtStrategy = () =>
  new JwtStrategy(options, async (jwt_payload, done) => {
    let user
    try {
      user = await User.findOne({email: jwt_payload.email}).exec()
      if (user) {
        return done(null, user)
      }
    } catch(err) {
      console.debug(err)
      return done(err, false)
    }
    return done(null, false)
  })

passport.use(getJwtStrategy())

module.exports = passport