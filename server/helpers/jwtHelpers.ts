import jwt from 'jsonwebtoken'
import config from '../config'

const { SECRET, TOKEN_EXPIRES_IN } = config.jwt

const signToken = (sub) => {
  return jwt.sign(
    {
      iss: 'storefly',
      sub,
    },
    SECRET,
    {
      expiresIn: TOKEN_EXPIRES_IN,
    },
  )
}

export { signToken }
