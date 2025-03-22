import request from 'supertest'
import server from '../../src/server'
import jwt from 'jsonwebtoken'
import config from '../../src/config/config'

const { SECRET } = config.jwt
const agent = request.agent(server)

async function login(email: string, password: string) {
  const res = await agent
    .post('/signin')
    .send({ email: email, password: password })

  const newToken = res.body.token
  return newToken
}

function decodeToken(token: string) {
  const decodedToken = jwt.verify(token, SECRET)
  return Number(decodedToken.sub)
}

export { login, decodeToken }
