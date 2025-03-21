import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptionsWithSecret,
} from 'passport-jwt'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as AnonymousStrategy } from 'passport-anonymous'
import { Strategy } from 'passport'
import config from './config'
import UserRepository from '../repositories/user-repository'
import { JwtPayload } from 'jsonwebtoken'

const cookieExtractor = (
  req: { header?: { cookie?: string } } | undefined,
): string | null => {
  let token = null
  if (req && req.header?.cookie) {
    token = req.header.cookie.replace('token=', '')
  }
  return token
}

interface KoaPassport {
  use(strategy: Strategy): void
}

const opts: StrategyOptionsWithSecret = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    cookieExtractor,
    ExtractJwt.fromHeader('authorization'),
  ]),
  secretOrKey: config.jwt.SECRET,
}
function passportConfig(passport: KoaPassport) {
  // JWT passport
  passport.use(
    new JwtStrategy(
      opts,
      async (
        payload: JwtPayload,
        done: (error: Error | null, user?: unknown, info?: unknown) => void,
      ) => {
        try {
          const user = await UserRepository.findById(Number(payload.sub))
          if (!user) {
            return done(null, false, undefined)
          }
          done(null, user)
        } catch (err) {
          done(err as Error, false)
        }
      },
    ),
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
