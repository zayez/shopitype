import test from 'tape'
import knex from '../../db'

import STATUS from '../../types/StatusCode'
import { login, decodeToken } from '../infrastructure/login'

import usersJson from '../fixtures/users.json'
const customers = usersJson.customers

import shippingAddressesJson from '../fixtures/shippingAddresses.json'
const shippingAddresses = shippingAddressesJson

import { server, placeOrder, getByUser, getOneByUser } from '../requests/orders'

test('setup', async (t) => {
  await knex.seed.run({ directory: 'tests/seeds' })
  t.end()
})

test('As a customer I should:', (t) => {
  const customer = customers[0]
  let token
  let customerId = ''

  t.test('setup', async (assert) => {
    token = await login(customer.email, customer.password)
    customerId = decodeToken(token)
    assert.end()
  })

  t.test('be able to sign in', async (assert) => {
    assert.notEqual(token, '', 'user signed in')
    assert.notEqual(customerId, '', 'token decoded')
    assert.end()
  })

  t.test('be able to place an order', async (assert) => {
    const product = await knex('products').first()
    const addr = { ...shippingAddresses[0] }
    delete addr.id

    const order = {
      paymentStatus: 'paid',
      shippingAddress: addr,
      items: [
        {
          productId: product.id,
          quantity: 1,
        },
      ],
    }

    const res = await placeOrder(order, { token, status: STATUS.Created })
    const createdOrder = res.body

    assert.equal(res.status, STATUS.Created)
    assert.equal(
      createdOrder.items[0].id,
      product.id,
      'order has the correct product',
    )
    assert.end()
  })

  t.test(
    'NOT be able to place order with nonexistent products',
    async (assert) => {
      const addr = { ...shippingAddresses[1] }
      delete addr.id

      const order = {
        paymentStatus: 'paid',
        shippingAddress: addr,
        items: [
          { productId: 9992, quantity: 1 },
          { productId: 9999, quantity: 1 },
        ],
      }

      const res = await placeOrder(order, {
        token,
        status: STATUS.Unprocessable,
      })

      assert.equal(res.status, STATUS.Unprocessable)
      assert.end()
    },
  )

  t.test('NOT be able to place order without items', async (assert) => {
    const addr = { ...shippingAddresses[0] }
    delete addr.id

    const order = {
      paymentStatus: 'paid',
      shippingAddress: addr,
      items: [],
    }

    const res = await placeOrder(order, {
      token,
      status: STATUS.Unprocessable,
    })

    assert.equal(res.status, STATUS.Unprocessable)
    assert.end()
  })

  t.test(
    'NOT be able to place order with insufficient inventory',
    async (assert) => {
      const product = await knex('products').first()
      const quantity = product.inventory + 10

      const addr = { ...shippingAddresses[2] }
      delete addr.id

      const order = {
        paymentStatus: 'paid',
        shippingAddress: addr,
        items: [{ productId: product.id, quantity }],
      }

      const res = await placeOrder(order, {
        token,
        status: STATUS.Unprocessable,
      })

      assert.equal(res.status, STATUS.Unprocessable)
      assert.end()
    },
  )

  t.test('be able to get my orders', async (assert) => {
    const products = await knex('products')
    const addr1 = { ...shippingAddresses[0] }
    delete addr1.id
    const addr2 = { ...shippingAddresses[1] }
    delete addr2.id

    const order1 = {
      paymentStatus: 'paid',
      shippingAddress: addr1,
      items: [
        {
          productId: products[1].id,
          quantity: 1,
        },
      ],
      dateOrder: new Date().toISOString(),
    }

    const order2 = {
      paymentStatus: 'paid',
      shippingAddress: addr2,
      items: [
        {
          productId: products[2].id,
          quantity: 1,
        },
      ],
      dateOrder: new Date().toISOString(),
    }

    await placeOrder(order1, { token, status: STATUS.Created })
    await placeOrder(order2, { token, status: STATUS.Created })

    const userOrders = (await knex('orders').where({ userId: customerId })).map(
      (o) => o.id,
    )

    const res = await getByUser(customerId, { token, status: STATUS.Ok })
    const retrievedOrders = res.body.map((o) => o.id)

    assert.equal(res.status, STATUS.Ok)
    assert.deepEqual(retrievedOrders, userOrders, 'retrieved orders match')
    assert.end()
  })

  t.test('NOT be able to get orders from another customer', async (assert) => {
    const order = await knex('orders').whereNot({ userId: customerId }).first()

    const res = await getByUser(order.userId, {
      token,
      status: STATUS.NotFound,
    })
    assert.equal(res.status, STATUS.NotFound)
    assert.end()
  })

  t.test('be able to get a specific order that I placed', async (assert) => {
    const order = await knex('orders').where({ userId: customerId }).first()

    const res = await getOneByUser(
      { orderId: order.id, userId: customerId },
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

  t.test(
    'NOT be able to get an order placed by another user',
    async (assert) => {
      const order = await knex('orders')
        .whereNot({ userId: customerId })
        .first()

      const res = await getOneByUser(
        { orderId: order.id, userId: order.userId },
        {
          token,
          status: STATUS.NotFound,
        },
      )
      assert.equal(res.status, STATUS.NotFound)
      assert.end()
    },
  )

  t.test('teardown', async (assert) => {
    assert.end()
  })
})

test('teardown', async (t) => {
  await server.close()
  t.end()
})
