import { ORDERS, POST_ORDER, USERS } from '../../api/endpoint-urls'
import requestBuilder from '../helpers/request-builder'
import { debugStatus, setHeaders } from '../helpers/request-helpers'
const { server, agent, getAll, getOne } = requestBuilder(ORDERS)

const placeOrder = async (order, { token, status }) => {
  const headers = setHeaders(token)
  return await agent
    .post(POST_ORDER)
    .send(order)
    .set(headers)
    .expect('Content-Type', /json/)
    .expect((res) => debugStatus(res, status))
    .expect(status)
    .then((res) => res)
}

const getByUser = async (userId, { token, status }) => {
  const headers = setHeaders(token)
  return await agent
    .get(`${USERS}/${userId}/orders`)
    .set(headers)
    .expect('Content-Type', /json/)
    .expect((res) => debugStatus(res, status))
    .expect(status)
    .then((res) => res)
}

const getOneByUser = async ({ orderId, userId }, { token, status }) => {
  const headers = setHeaders(token)
  return await agent
    .get(`${USERS}/${userId}/orders/${orderId}`)
    .set(headers)
    .expect('Content-Type', /json/)
    .expect((res) => debugStatus(res, status))
    .expect(status)
    .then((res) => res)
}

export { server, agent, getAll, getOne, placeOrder, getByUser, getOneByUser }
