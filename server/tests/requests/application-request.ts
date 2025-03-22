import request from 'supertest'
import server from '../../src/server'
import { debugStatus, setHeaders } from '../helpers/request-helpers'
import {
  GET_ROOT,
  POST_SIGN_IN,
  POST_SIGN_UP,
} from '../../src/api/endpoint-urls'
import { StatusCodeType } from '../../src/types/status-code'
import { RequestParams } from '../helpers/request-builder'
import { User } from '../../src/models/user'

const agent = request.agent(server)

const getRoot = async (status: StatusCodeType) => {
  const headers = setHeaders()
  return await agent
    .get(GET_ROOT)
    .set(headers)
    .expect('Content-Type', /json/)
    .expect((res) => debugStatus(res, status))
    .expect(status)
    .then((res) => res)
}

const signIn = async (
  email: string,
  password: string,
  { status }: RequestParams,
) => {
  const headers = setHeaders()
  return await agent
    .post(POST_SIGN_IN)
    .send({ email: email, password: password })
    .set(headers)
    .expect('Content-Type', /json/)
    .expect((res) => debugStatus(res, status))
    .expect(status)
    .then((res) => res)
}

const signUp = async (user: User, { status }: RequestParams) => {
  const headers = setHeaders()
  return await agent
    .post(POST_SIGN_UP)
    .send(user)
    .set(headers)
    .expect('Content-Type', /json/)
    .expect((res) => debugStatus(res, status))
    .expect(status)
    .then((res) => res)
}

const getUser = async ({ token, status }: RequestParams) => {
  const headers = setHeaders(token)
  return await agent
    .get(`/user`)
    .set(headers)
    .expect('Content-Type', /json/)
    .expect((res) => debugStatus(res, status))
    .expect(status)
    .then((res) => res)
}

export { server, getRoot, signIn, signUp, getUser }
