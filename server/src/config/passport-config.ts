import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as AnonymousStrategy } from 'passport-anonymous'
import config from './config'
import UserRepository from '../repositories/user-repository'

const { fromExtractors, fromHeader } = ExtractJwt
const { SECRET } = config.jwt

const cookieExtractor = (req) => {
  let token = null
  if (req && req.header.cookie) {
    token = req.header.cookie.replace('token=', '')
  }
  return token
}

interface PassportOptions {
  jwtFromRequest?: string
  secretOrKey?: string
}

const opts: PassportOptions = {}
opts.jwtFromRequest = fromExtractors([
  cookieExtractor,
  fromHeader('authorization'),
])
opts.secretOrKey = SECRET

function passportConfig(passport) {
  // JWT passport
  passport.use(
    new JwtStrategy(opts, async (payload, done) => {
      try {
        const user = await UserRepository.findById(payload.sub)
        if (!user) {
          return done(null, false)
        }
        done(null, user)
      } catch (err) {
        done(err, false)
      }
    }),
  )

  // Local passport
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
      },
      async (email, password, done) => {
        try {
          const user = await UserRepository.findOne({ email })
          if (!user) {
            return done(null, false)
          }

          const isPasswordMatch = await UserRepository.matchPassword(
            email,
            password,
          )

          if (!isPasswordMatch) {
            return done(null, false)
          }

          done(null, user)
        } catch (err) {
          done(err, false)
        }
      },
    ),
  )

  // Anonymous passport
  passport.use(new AnonymousStrategy())
}

export default passportConfig
