import test from 'tape'
import knex from '../../db'
import STATUS from '../../types/status-code'
import { login, decodeToken } from '../infrastructure/login'
import {
  server,
  getByUser,
  getOneByUser,
  getAll,
  getOne,
} from '../requests/orders-request'
import usersJson from '../fixtures/users.json'

const editors = usersJson.editors

test('setup', async (t) => {
  await knex.migrate.latest()
  await knex.seed.run({ directory: 'tests/seeds' })
  t.end()
})

test('As a manager(admin/editor) I should:', (t) => {
  const manager = editors[0]
  let token
  let managerId = ''

  t.test('setup', async (assert) => {
    token = await login(manager.email, manager.password)
    managerId = decodeToken(token)
    assert.end()
  })

  t.test('be able to sign in', async (assert) => {
    assert.notEqual(token, '', 'user signed in')
    assert.notEqual(managerId, '', 'token decoded')
    assert.end()
  })

  t.test('be able to get any specific order', async (assert) => {
    const order = await knex('orders').whereNot({ userId: managerId }).first()

    const res = await getOne(order.id, { token, status: STATUS.Ok })
    const retrievedOrder = res.body

    assert.equal(res.status, STATUS.Ok, 'correct status')
    assert.equal(order.id, retrievedOrder.id, 'order is the same')
    assert.end()
  })

  t.test('be able to get any specific order by any user', async (assert) => {
    const order = await knex('orders').whereNot({ userId: managerId }).first()

    const res = await getOneByUser(
      { orderId: order.id, userId: order.userId },
      {
        token,
        status: STATUS.Ok,
      },
    )
    const retrievedOrder = res.body
    assert.equal(res.status, STATUS.Ok, 'response returns correct status code')
    assert.equal(retrievedOrder.id, order.id, 'is the same order')
    assert.end()
  })

  t.test('be able to get all orders from a specific user', async (assert) => {
    const order = await knex('orders').whereNot({ userId: managerId }).first()
    const orders = await knex('orders').where({ userId: order.userId })
    const ordersIds = orders.map((o) => o.id)

    const res = await getByUser(order.userId, { token, status: STATUS.Ok })
    const retrievedOrdersIds = res.body.map((o) => o.id)

    assert.equal(res.status, STATUS.Ok, 'correct status code')
    assert.deepEqual(retrievedOrdersIds, ordersIds, 'orders retrieved match')
    assert.end()
  })

  t.test('be able to get all orders', async (assert) => {
    const orders = await knex('orders')
    const ordersIds = orders.map((o) => o.id)

    const res = await getAll({ token, status: STATUS.Ok })
    const resRetrievedOrdersIds = res.body.map((o) => o.id)

    assert.equal(res.status, STATUS.Ok, 'status is correct')
    assert.deepEqual(resRetrievedOrdersIds, ordersIds, 'correct orders')
    assert.end()
  })

  t.test('teardown', async (assert) => {
    assert.end()
  })
})

test('teardown', async (t) => {
  await server.close()
  t.end()
})
