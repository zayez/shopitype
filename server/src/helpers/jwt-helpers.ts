import jwt, { Secret, SignOptions } from 'jsonwebtoken'
import config from '../config/config'

const { SECRET, TOKEN_EXPIRES_IN } = config.jwt

const signToken = (sub: number) => {
  const opts: SignOptions = {
    expiresIn: TOKEN_EXPIRES_IN as SignOptions['expiresIn'],
  }
  return jwt.sign(
    {
      iss: 'shopitype',
      sub,
    },
    SECRET as Secret,
    opts,
  )
}

export { signToken }
