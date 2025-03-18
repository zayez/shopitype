import request from 'supertest'
import server from '../../src/server'
import jwt from 'jsonwebtoken'
import config from '../../src/config/config'

const { SECRET } = config.jwt
const agent = request.agent(server)

async function login(email, password) {
  const res = await agent
    .post('/signin')
    .send({ email: email, password: password })

  const newToken = res.body.token
  return newToken
}

function decodeToken(token) {
  const decodedToken = jwt.verify(token, SECRET)
  return decodedToken.sub
}

export { login, decodeToken }
